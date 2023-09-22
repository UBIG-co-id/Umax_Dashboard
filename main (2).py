from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Query, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
import re
from PIL import Image
import io
from io import BytesIO
from gridfs import GridFS
from config import get_database_connection
from mongonator import MongoClientWithPagination, ASCENDING, Paginate, DESCENDING
from urllib.parse import unquote
from typing import Optional, Union, List
import calendar
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
client, db, campaigns_collection, accounts_collection, clients_collection, staff_collection, dashboard_collection, history_collection, metrics_collection = get_database_connection("mongodb+srv://abdiirf1y:abdiirf2134@umax.diiz7t7.mongodb.net/")
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

# Allow these methods to be used
methods = ["GET", "POST", "PUT", "DELETE"]

headers = ["Content-Type", "Authorization"]
# Only these headers are allowed
# headers: {
#   'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1hIjoiYWJkaXJpbyIsInJvbGVzIjoic3RhZmYiLCJleHAiOjE2OTQ3NjM0NzZ9.46n1a3M9XwQMLRIOu_K0DkI7p4ejyMhx6nZK9i1kJkE',
#   'Content-Type': 'application/json',
# } 

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key untuk signing JWT
SECRET_KEY = "thisisverysecretsuperadminpassword"
ALGORITHM = "HS256"

# Enkripsi dan verifikasi kata sandi
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT utils
def generate_jwt_token(nama, roles: str) -> str:
    payload = {"nama": nama, "roles": roles, "exp": datetime.utcnow() + timedelta(days=1)}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM).encode("utf-8")
    return token

def decode_jwt_token(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload

# Dependencies
def get_current_user(roles: str = Depends(HTTPBearer())) -> str:
    credentials_data = decode_jwt_token(roles.credentials)
    roles = credentials_data.get("roles", [])
    if not roles:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")
    return roles

# Rute untuk pendaftaran dan login pengguna
@app.post("/register/", tags=["Akun"])
async def register_user(nama: str = Form(...), email: str = Form(...), password: str = Form(...), konfirmasi_password: str = Form(...)):
    # Validasi panjang karakter dan tipe data
    if len(nama) < 3 or len(password) < 6:
        raise HTTPException(status_code=400, detail="nama minimal 3 karakter dan password minimal 6 karakter")
    
    # Validasi alamat email menggunakan regular expression
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_regex, email):
        raise HTTPException(status_code=400, detail="Alamat email tidak valid")
    
    # Validasi konfirmasi password
    if password != konfirmasi_password:
        raise HTTPException(status_code=400, detail="Konfirmasi password tidak cocok dengan password")
    
    existing_user = staff_collection.find_one({"$or": [{"nama": nama}, {"email": email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="nama / email telah digunakan")
    
    
    hashed_password = pwd_context.hash(password)
    
    # Simpan data pengguna ke basis data
    new_user = {
        "nama": nama,
        "email": email,
        "password": hashed_password,
        "is_admin": False
    }

    staff_collection.insert_one(new_user)
    
    return {"message": "Pendaftaran berhasil"}


@app.post("/login/", tags=["Akun"])
def login(email: str, password: str) -> str:
    # Cari user berdasarkan email
    user = staff_collection.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="Email tidak valid")

    # Verifikasi kata sandi
    is_valid_password = pwd_context.verify(password, user["password"])
    if not is_valid_password:
        raise HTTPException(status_code=401, detail="Kata sandi tidak valid")

    # Tentukan peran berdasarkan is_admin
    roles = "staff" if user["is_admin"] is False else "admin"

    # Generate JWT token
    token = generate_jwt_token(email, roles)
    return token


#dashboard

# history
class HistoryCreate(BaseModel):
    lastupdate: str
    amountspent: str
    reach: str
    impressions: str
    frequency: str
    rar: str
    cpc: str
    ctr: str
    oclp: str
    cpr: str
    atc: str
    roas: str
    is_admin: bool

@app.post("/metrics", tags=["Dashboard"], dependencies=[Depends(get_current_user)])
def create_metrics(
    lastupdate: str = Form(...),
    amountspent: str = Form(...),
    reach: str = Form(...),
    impressions: str = Form(...),
    frequency: str = Form(...),
    rar: str = Form(...),
    cpc: str = Form(...),
    ctr: str = Form(...),
    oclp: str = Form(...),
    cpr: str = Form(...),
    atc: str = Form(...),
    roas: str = Form(...),
    is_admin: bool = Form(...),
    roles: str = Depends(get_current_user)):
    if "staff" in roles:
        # Periksa apakah metrics sudah ada dalam database
        existing_metrics = metrics_collection.find_one({"lastupdate": lastupdate})
        if existing_metrics:
            raise HTTPException(status_code=400, detail="metrics sudah ada dalam database")

        metrics = {
            "lastupdate": lastupdate,
            "amountspent": amountspent,
            "reach": reach,
            "impressions": impressions,
            "frequency": frequency,
            "rar": rar,
            "cpc": cpc,
            "ctr": ctr,
            "oclp": oclp,
            "cpr": cpr,
            "atc": atc,
            "roas": roas,
            "is_admin": is_admin,
            "Id": str(ObjectId()),  # Menambahkan field "Id" dengan ObjectId baru
            "TglInsert": datetime.now().isoformat()  # Menambahkan field "TglInsert" dengan tanggal saat ini
        }
        id = metrics_collection.insert_one(metrics).inserted_id
        return {
            "_id": str(id),
            "lastupdate": metrics["lastupdate"],
            "amountspent": metrics["amountspent"],
            "reach": metrics["reach"],
            "impressions": metrics["impressions"],
            "frequency": metrics["frequency"],
            "rar": metrics["rar"],
            "cpc": metrics["cpc"],
            "ctr": metrics["ctr"],
            "oclp": metrics["oclp"],
            "cpr": metrics["cpr"],
            "atc": metrics["atc"],
            "roas": metrics["roas"],
            "Id": metrics["Id"],  # Mengembalikan field "Id"
            "TglInsert": metrics["TglInsert"],  # Mengembalikan field "TglInsert"
            "is_admin": metrics["is_admin"],
        }
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")
    
@app.get("/metrics/", tags=["Dashboard"])
def get_all_metrics():
    # Implementasi endpoint tanpa dependensi
    metrics = list(metrics_collection.find())

    # Mengubah format ObjectId ke string untuk respons
    for metrics in metrics:
        metrics["_id"] = str(metrics["_id"])

    return metrics
    
@app.get("/history/", tags=["Dashboard"])
def get_all_history():
    # Implementasi endpoint tanpa dependensi
    metrics = list(metrics_collection.find())

    # Mengubah format ObjectId ke string untuk respons
    for metrics in metrics:
        metrics["_id"] = str(metrics["_id"])

    return metrics

@app.get("/performancelist/{id}", tags=["Dashboard"])
def get_performancelist(id: str):
    # Decode the URL-encoded parameter
    decoded_id = unquote(id)

    # Now you can use the decoded "id" parameter in your database query
    performancelist = campaigns_collection.find_one({"_id": ObjectId(decoded_id)})
    
    if performancelist is None:
        raise HTTPException(status_code=404, detail="Performancelist tidak ditemukan")
    
    return {
        "_id": str(performancelist["_id"]),
        "name": performancelist["name"],
        "startdate": performancelist["startdate"],
        "amountspent": performancelist["amountspent"],
        "reach": performancelist["reach"],
    }

@app.get("/performancelist", tags=["Dashboard"])
def get_all_performancelist():
    # Retrieve a list of campaigns from the database
    performance_list = list(campaigns_collection.find())
    
    # Transform the campaigns into the desired format
    formatted_performance = []
    for performancelist in performance_list:
        formatted_campaign = {
            "_id": str(performancelist["_id"]),
            "name": performancelist["name"],
            "startdate": performancelist["startdate"],
            "amountspent": performancelist["amountspent"],
            "reach": performancelist["reach"],
        }
        formatted_performance.append(formatted_campaign)  # Append each formatted campaign to the list
    
    return formatted_performance

@app.get("/cardperformance/{id}", tags=["Dashboard"])
def get_cardperformance(id: str):
    # Decode the URL-encoded parameter
    decoded_id = unquote(id)

    # Now you can use the decoded "id" parameter in your database query
    cardperformance = metrics_collection.find_one({"_id": ObjectId(decoded_id)})
    
    if cardperformance is None:
        raise HTTPException(status_code=404, detail="Cardperformance tidak ditemukan")
    
    return {
        "_id": str(cardperformance["_id"]),
        "amountspent": cardperformance["amountspent"],
        "rar": cardperformance["rar"],
        "ctr": cardperformance["ctr"],
        "oclp": cardperformance["oclp"],
        "cpr": cardperformance["cpr"],
        "atc": cardperformance["atc"],
        "roas": cardperformance["roas"],
    }

# campaigns

class Campaign(BaseModel):
    name: str
    objective: str
    client: str
    account: str
    platform: str
    amountspent: str
    reach: str
    startdate: datetime
    enddate: datetime
    status: str
    notes: Optional[Union[str, None]] = None
    is_admin: bool


@app.post("/campaigns", tags=["Campaigns"], dependencies=[Depends(get_current_user)])
def create_campaigns(name: str = Form(...),
    objective: str = Form(...),
    client: str = Form(...),
    account: str = Form(...),
    platform: str = Form(...),
    amountspent: str = Form(...),
    reach: str = Form(...),
    startdate: datetime = Form(...),
    enddate: datetime = Form(...),
    notes: str = Form(...),
    status: int = Form(...),
    is_admin: bool = Form(...),
    roles: str = Depends(get_current_user)):
    if "staff" in roles:
        # Periksa apakah campaigns sudah ada dalam database
        existing_campaigns = campaigns_collection.find_one({"name": name})
        if existing_campaigns:
            raise HTTPException(status_code=400, detail="campaigns sudah ada dalam database")

        campaigns = {
        "name": name,
        "objective": objective,
        "client": client,
        "account": account,
        "platform": platform,
        "amountspent": amountspent,
        "reach": reach,
        "startdate": startdate,
        "enddate": enddate,
        "notes": notes,
        "status": status,
        "is_admin": is_admin,
        }
        id = campaigns_collection.insert_one(campaigns).inserted_id
        return {
        "_id": str(id),
        "name": campaigns["name"],
        "objective": campaigns["objective"],
        "client": campaigns["client"],
        "account": campaigns["account"],
        "platform": campaigns["platform"],
        "amountspent": campaigns["amountspent"],
        "reach": campaigns["reach"],
        "startdate": campaigns["startdate"],
        "endate": campaigns["enddate"],
        "notes": campaigns["notes"],
        "status": campaigns["status"],
        "is_admin": campaigns["is_admin"]
        }

    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.patch("/campaigns/{id}", tags=["Campaigns"], dependencies=[Depends(get_current_user)])
def update_campaigns(
    id: str,
    name: str = Form (None),
    objective: str = Form (None),
    client: str = Form (None),
    account: str = Form (None),
    platform: str = Form (None),
    amountspent: str = Form (None),
    reach: str = Form (None),
    startdate: datetime = Form (None),
    enddate: datetime = Form (None),
    status: int = Form (None),
    notes: str = Form (None),
    is_admin: bool = Form (None),
    roles: str = Depends(get_current_user)
):
    if "staff" in roles or "admin" in roles:
        # Membuat filter berdasarkan ID
        campaigns_filter = {"_id": ObjectId(id)}

        # Membuat update berdasarkan parameter yang diberikan
        update_data = {}
        if name is not None:
            update_data["name"] = name
        if objective is not None:
            update_data["objective"] = objective
        if client is not None:
            update_data["client"] = client
        if account is not None:
            update_data["account"] = account
        if platform is not None:
            update_data["platform"] = platform
        if amountspent is not None:
            update_data["amountspent"] = amountspent
        if reach is not None:
            update_data["reach"] = reach
        if startdate is not None:
            update_data["startdate"] = startdate
        if enddate is not None:
            update_data["enddate"] = enddate
        if status is not None:
            update_data["status"] = status
        if notes is not None:
            update_data["notes"] = notes
        if is_admin is not None:
            update_data["is_admin"] = is_admin

        # Melakukan update pada dokumen
        update_result = campaigns_collection.update_one(campaigns_filter, {"$set": update_data})

        if update_result.modified_count > 0:
            return {"message": "Update Campaigns Successfully"}
        else:
            raise HTTPException(status_code=404, detail="Campaigns tidak ditemukan")
        
    else:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.delete("/campaigns/{id}", tags=["Campaigns"], dependencies=[Depends(get_current_user)])
async def delete_campaign(id: str, roles: str = Depends(get_current_user)):
    # Decode the URL-encoded parameter
    if "staff" in roles or "admin" in roles:
        decoded_id = unquote(id)

        # Now you can use the decoded "id" parameter in your database query
        campaigns = campaigns_collection.find_one({"_id": ObjectId(decoded_id)})
        if campaigns is None:
            raise HTTPException(status_code=404, detail="Camapigns tidak ditemukan")
        
        campaigns_collection.delete_one({"_id": ObjectId(decoded_id)})
        return {"Campaigns dihapus": str(campaigns["_id"])}
    else:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.get("/campaigns/{id}", tags=["Campaigns"])
def get_campaigns(id: str):
    # Decode the URL-encoded parameter
    decoded_id = unquote(id)

    # Now you can use the decoded "id" parameter in your database query
    campaigns = campaigns_collection.find_one({"_id": ObjectId(decoded_id)})
    
    if campaigns is None:
        raise HTTPException(status_code=404, detail="Campaigns tidak ditemukan")
    
    return {
        "_id": str(campaigns["_id"]),
        "name": campaigns["name"],
        "objective": campaigns["objective"],
        "client": campaigns["client"],
        "account": campaigns["account"],
        "platform": campaigns["platform"],
        "startdate": campaigns["startdate"],
        "enddate": campaigns["enddate"],
        "notes": campaigns.get("notes", ""),  # Optional field, provide a default value
        "status": campaigns["status"],
        "is_admin": campaigns["is_admin"]
    }

@app.get("/campaigns", tags=["Campaigns"])
def get_all_campaigns():
        # Retrieve a list of campaigns from the database
        campaigns_list = list(campaigns_collection.find())
        
        # Transform the campaigns into the desired format
        formatted_campaigns = []
        for campaign in campaigns_list:
            formatted_campaign = {
                "_id": str(campaign["_id"]),
                "name": campaign["name"],
                "objective": campaign["objective"],
                "client": campaign["client"],
                "account": campaign["account"],
                "platform": campaign["platform"],
                "startdate": campaign["startdate"],
                "enddate": campaign["enddate"],
                "notes": campaign.get("notes", ""),  # Optional field, provide a default value
                "status": campaign["status"],
                "is_admin": campaign["is_admin"]
            }
            formatted_campaigns.append(formatted_campaign)
        
        return formatted_campaigns

#account

class AccountsCreate(BaseModel):
    name: str
    client: str
    platform: str
    email: str
    password: str
    notes: Optional[Union[str, None]] = None
    status: int
    is_admin: bool

@app.post("/accounts", tags=["Accounts"], dependencies=[Depends(get_current_user)])
def create_accounts(
    name: str = Form(...),
    client: str = Form(...),
    platform: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    notes: str = Form(...),
    status: int = Form(...),
    is_admin: bool = Form(...),
    roles: str = Depends(get_current_user)
):
    if "staff" in roles:
        # Check if an account with the same name already exists
        existing_account = accounts_collection.find_one({"name": name})
        if existing_account:
            raise HTTPException(status_code=400, detail="Account already exists in the database")

        # If the account doesn't exist, proceed to create it
        account = {
            "name": name,
            "client": client,
            "platform": platform,
            "email": email,
            "password": password,
            "notes": notes,
            "status": status,
            "is_admin": is_admin,
        }
        id = accounts_collection.insert_one(account).inserted_id
        return {
            "_id": str(id),
            "name": account["name"],
            "client": account["client"],
            "platform": account["platform"],
            "email": account["email"],
            "password": account["password"],
            "notes": account["notes"],
            "status": account["status"],
            "is_admin": account["is_admin"],
        }
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.patch("/accounts/{id}", tags=["Accounts"], dependencies=[Depends(get_current_user)])
def update_accounts(
    id: str,
    name: str = Form (None),
    client: str = Form (None),
    platform: str = Form (None),
    email: str = Form (None),
    password: str = Form (None),
    notes: str = Form (None),
    status: int = Form (None),
    is_admin: bool = Form (None),
    roles: str = Depends(get_current_user)
):
    if "staff" in roles or "admin" in roles:
        # Membuat filter berdasarkan ID
        accounts_filter = {"_id": ObjectId(id)}

        # Membuat update berdasarkan parameter yang diberikan
        update_data = {}
        if name is not None:
            update_data["name"] = name
        if client is not None:
            update_data["client"] = client
        if platform is not None:
            update_data["platform"] = platform
        if email is not None:
            update_data["email"] = email
        if status is not None:
            update_data["status"] = status
        if password is not None:
            update_data["password"] = password
        if notes is not None:
            update_data["notes"] = notes
        if is_admin is not None:
            update_data["is_admin"] = is_admin

        # Melakukan update pada dokumen
        update_result = accounts_collection.update_one(accounts_filter, {"$set": update_data})

        if update_result.modified_count > 0:
            return {"message": "Update Accounts Successfully"}
        else:
            raise HTTPException(status_code=404, detail="Accounts tidak ditemukan")
        
    else:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.delete("/accounts/{id}", tags=["Accounts"], dependencies=[Depends(get_current_user)])
def delete_accounts(id: str, roles: str = Depends(get_current_user)):
    # Decode the URL-encoded parameter
    if "staff" in roles or "admin" in roles:
        decoded_id = unquote(id)

        # Now you can use the decoded "id" parameter in your database query
        accounts = accounts_collection.find_one({"_id": ObjectId(decoded_id)})
        if accounts is None:
            raise HTTPException(status_code=404, detail="Accounts tidak ditemukan")
        
        accounts_collection.delete_one({"_id": ObjectId(decoded_id)})
        return {"Accounts dihapus": str(accounts["_id"])}
    else:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.get("/accounts", tags=["Accounts"])
def get_all_accounts():
    # Implementasi endpoint tanpa dependensi
    accounts = list(accounts_collection.find())

    # Mengubah format ObjectId ke string untuk respons
    for account in accounts:
        account["_id"] = str(account["_id"])

    return accounts


#clients


class clients(BaseModel):
    name: str
    address: str
    contact: str
    status: int
    is_admin: bool
    notes: Optional[Union[str, None]] = None


@app.post("/clients", tags=["Clients"], dependencies=[Depends(get_current_user)])
def create_clients(name: str = Form(...),
    address: str = Form(...),
    contact: str = Form(...),
    notes: str = Form(...),
    status: int = Form(...),
    is_admin: bool = Form(...),
    roles: str = Depends(get_current_user)):
    if "staff" in roles:
        # Periksa apakah clients sudah ada dalam database
        existing_clients = clients_collection.find_one({"name": name})
        if existing_clients:
            raise HTTPException(status_code=400, detail="clients sudah ada dalam database")

        clients_data = {
        "name": name,
        "address": address,
        "contact": contact,
        "notes": notes,
        "status": status,
        "is_admin": is_admin,
        }
        id = clients_collection.insert_one(clients_data).inserted_id
        return {
        "_id": str(id),
        "name": clients_data["name"],
        "address": clients_data["address"],
        "contact": clients_data["contact"],
        "notes": clients_data["notes"],
        "status": clients_data["status"],
        "is_admin": clients_data["is_admin"],
        }

    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.patch("/clients/{id}", tags=["Clients"], dependencies=[Depends(get_current_user)])
def update_clients(
    id: str,
    name: str = Form (None),
    address: str = Form (None),
    contact: str = Form (None),
    notes: str = Form (None),
    status: int = Form (None),
    is_admin: bool = Form (None),
    roles: str = Depends(get_current_user)
):
    if "staff" in roles or "admin" in roles:
        # Membuat filter berdasarkan ID
        clients_filter = {"_id": ObjectId(id)}

        # Membuat update berdasarkan parameter yang diberikan
        update_data = {}
        if name is not None:
            update_data["name"] = name
        if address is not None:
            update_data["address"] = address
        if contact is not None:
            update_data["contact"] = contact
        if notes is not None:
            update_data["notes"] = notes
        if status is not None:
            update_data["status"] = status
        if is_admin is not None:
            update_data["is_admin"] = is_admin

        # Melakukan update pada dokumen
        update_result = clients_collection.update_one(clients_filter, {"$set": update_data})

        if update_result.modified_count > 0:
            return {"message": "Update Clients Successfully"}
        else:
            raise HTTPException(status_code=404, detail="Clients tidak ditemukan")
        
    else:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.delete("/clients/{id}", tags=["Clients"], dependencies=[Depends(get_current_user)])
def delete_clients(id: str, roles: str = Depends(get_current_user)):
    # Decode the URL-encoded parameter
    if "staff" in roles or "admin" in roles:
        decoded_id = unquote(id)

        # Now you can use the decoded "id" parameter in your database query
        clients = clients_collection.find_one({"_id": ObjectId(decoded_id)})
        if clients is None:
            raise HTTPException(status_code=404, detail="Clients tidak ditemukan")
        
        clients_collection.delete_one({"_id": ObjectId(decoded_id)})
        return {"Clients dihapus": str(clients["_id"])}
    else:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.get("/clients", tags=["Clients"])
def get_all_clients():
    # Implementasi endpoint tanpa dependensi
    clients = list(clients_collection.find())

    # Mengubah format ObjectId ke string untuk respons
    for client in clients:
        client["_id"] = str(client["_id"])

    return clients

if __name__ == "__main__":
    app.run(debug=True)
