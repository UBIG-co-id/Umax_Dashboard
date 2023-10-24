from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Query, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import base64
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
import re
from PIL import Image
import io
from io import BytesIO
from fastapi.encoders import jsonable_encoder
from fastapi import Path
from gridfs import GridFS
import os
from config import get_database_connection
from mongonator import MongoClientWithPagination, ASCENDING, Paginate, DESCENDING
from urllib.parse import unquote
from typing import Optional, Union, List
import calendar
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
client, db, campaigns_collection, accounts_collection, clients_collection, staff_collection, dashboard_collection, history_collection, metrics_collection, profil_collection = get_database_connection("mongodb+srv://abdiirf1y:abdiirf2134@umax.diiz7t7.mongodb.net/")
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
def generate_jwt_token(user_id, nama, roles: str) -> str:
    payload = {"user_id": user_id, "nama": nama, "roles": roles, "exp": datetime.utcnow() + timedelta(days=1)}
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

# Fungsi untuk mengonversi gambar ke base64
def image_to_base64(image_data):
    return base64.b64encode(image_data).decode()

# Rute untuk pendaftaran dan login pengguna
@app.post("/register/", tags=["Akun"])
async def register(nama: str = Form(...), email: str = Form(...), password: str = Form(...), konfirmasi_password: str = Form(...)):
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

# Fungsi untuk mengirim email pemulihan kata sandi
def send_reset_password_email(email: str, reset_token: str):
    # Konfigurasi email
    sender_email = "<your_email_sender>"
    sender_password = "<your_email_password>"
    subject = "Reset Password"
    message = f"Klik tautan berikut untuk mereset kata sandi Anda: {reset_token}"
    
    # Buat pesan email
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = email
    msg["Subject"] = subject
    msg.attach(MIMEText(message, "plain"))
    
    # Kirim email menggunakan SMTP
    try:
        server = smtplib.SMTP("smtp.example.com", 587)  # Ganti dengan server SMTP Anda
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Kesalahan dalam mengirim email: {str(e)}")

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

    # Generate JWT token dengan user_id
    token = generate_jwt_token(str(user["_id"]), email, roles)  # Ubah user_id menjadi str() jika perlu
    return token

@app.get("/users", tags=["Akun"])
def get_all_users():
    # Implementasi endpoint tanpa dependensi
    users = list(staff_collection.find())

    # Mengubah format ObjectId ke string untuk respons
    for user in users:
        user["_id"] = str(user["_id"])

    return users

@app.get("/user/{user_id}", tags=["Akun"])
async def get_user_by_id(user_id: str):
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="ID user tidak valid.")

        user = staff_collection.find_one({"$or": [{"_id": ObjectId(user_id)}, {"email": user_id}]})
        if user is None:
            raise HTTPException(status_code=404, detail="User tidak ditemukan.")

        # Mengubah format ObjectId ke string untuk respons
        user["_id"] = str(user["_id"])

        return user

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan dalam mengakses database: {str(e)}")

@app.put("/user/change-role/", tags=["Akun"])
async def change_user_role(
    user_id: str,
    nama: str = Form(default=None),
    email: str = Form(default=None),
    notelpon: str = Form(default=None),
    alamat: str = Form(default=None),
    is_admin: bool = Form(...),
    image: UploadFile = File(None)
):
        try:
            if not ObjectId.is_valid(user_id):
                raise HTTPException(status_code=400, detail="ID user tidak valid.")

            user = staff_collection.find_one({"$or": [{"_id": ObjectId(user_id)}, {"email": user_id}]})
            if user is None:
                raise HTTPException(status_code=404, detail="User tidak ditemukan.")

            update_data = {}

            if nama is not None:
                update_data["nama"] = nama

            if email is not None:
                update_data["email"] = email

            if notelpon is not None:
                update_data["notelpon"] = notelpon

            if alamat is not None:
                update_data["alamat"] = alamat

            if image:
                image_content = await image.read()
                image_base64 = base64.b64encode(image_content).decode("utf-8")
                update_data["image"] = image_base64

            # Update peran pengguna (is_admin) dalam basis data
            update_data["is_admin"] = is_admin

            staff_collection.update_one({"_id": user["_id"]}, {"$set": update_data})

            return {"message": "Peran user berhasil diubah"}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Terjadi kesalahan dalam mengakses database: {str(e)}")


@app.post("/user/reset-password/", tags=["Akun"])
async def reset_password(email: str, new_password: str, konfirmasi_password: str):
    # Verifikasi tautan pemulihan kata sandi dan email
    # Anda harus memiliki logika untuk menghasilkan dan memeriksa tautan pemulihan
   
    # Temukan pengguna berdasarkan email
    user = staff_collection.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")

    # Setel kata sandi baru setelah verifikasi
    hashed_password = pwd_context.hash(konfirmasi_password)
    staff_collection.update_one({"_id": user["_id"]}, {"$set": {"password": hashed_password}})
    
    return {"message": "Kata sandi berhasil diubah"}

@app.delete("/user/delete/{user_id}", tags=["Akun"])
async def delete_user(user_id: str, roles: str = Depends(get_current_user)):
    # Pastikan user yang meminta penghapusan akun adalah administrator
    if "admin" in roles:
        # if not current_user:
        #     raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk menghapus akun user")

        # Cari user berdasarkan ID (atau email) di basis data
        user = staff_collection.find_one({"$or": [{"_id": ObjectId(user_id)}, {"email": user_id}]})
        if user is None:
            raise HTTPException(status_code=404, detail="User tidak ditemukan")

        # Hapus akun user dari basis data
        staff_collection.delete_one({"_id": user["_id"]})

        return {"message": "Akun user berhasil dihapus"}
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

#history

# @app.post("/history", tags=["History"])
# def create_metrics(
#     id_metrics: str = Form(...),
# ):
#         # Periksa apakah metrics sudah ada dalam database

#         history_data = {
#         "id_metrics": id_metrics,
#         }
#         id = history_collection.insert_one(history_data).inserted_id
#         return {
#         "_id": str(id),
#         "id_metrics": history_data["id_metrics"],
#         }


@app.get("/historyy/", tags=["History"])
def get_all_history():
    # Ambil semua data metrik dari database
    historys_list = list(history_collection.find())

    formatted_historys = []
    for history in historys_list:
        id_metrics = history.get("id_metrics")
        metrics_amountspent = None
        metrics_reach = None
        metrics_impressions = None
        metrics_frequency = None
        metrics_rar = None
        metrics_cpc = None
        metrics_ctr = None
        metrics_oclp = None
        metrics_cpr = None
        metrics_atc = None
        metrics_roas = None
        metrics_realroas = None
        metrics_TglUpdate = None
    
        if id_metrics:
            metric = metrics_collection.find_one({"_id": ObjectId(id_metrics)})
            if metric:
                metrics_amountspent = metric.get("amountspent")
                metrics_reach = metric.get("reach")
                metrics_impressions = metric.get("impressions")
                metrics_frequency = metric.get("frequency")
                metrics_rar = metric.get("rar")
                metrics_cpc = metric.get("cpc")
                metrics_ctr = metric.get("ctr")
                metrics_oclp = metric.get("oclp")
                metrics_cpr = metric.get("cpr")
                metrics_atc = metric.get("atc")
                metrics_roas = metric.get("roas")
                metrics_realroas = metric.get("realroas")
                metrics_TglUpdate = metric.get("TglUpdate")

        formatted_history = {
            "_id": str(history["_id"]),
            "id_metrics": id_metrics,
            "metrics_amountspent": metrics_amountspent,
            "metrics_reach": metrics_reach,
            "metrics_impressions": metrics_impressions, 
            "metrics_frequency": metrics_frequency,
            "metrics_rar": metrics_rar,
            "metrics_cpc": metrics_cpc,
            "metrics_ctr": metrics_ctr,
            "metrics_oclp": metrics_oclp,
            "metrics_cpr": metrics_cpr,
            "metrics_atc": metrics_atc,
            "metrics_roas": metrics_roas,
            "metrics_realroas": metrics_realroas,
            "metrics_TglUpdate": metrics_TglUpdate,
        }
        formatted_historys.append(formatted_history)

    return formatted_historys

@app.get("/history/{id_metrics}", tags=["History"])
def get_metric_history(id_metrics: str):
    try:
        id_metrics = ObjectId(id_metrics)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id_metrics")

    history_entries = list(history_collection.find({"id_metrics": id_metrics}))

    if history_entries:
        # Mengubah ObjectId menjadi string
        for entry in history_entries:
            entry["_id"] = str(entry["_id"])
            entry["id_metrics"] = str(entry["id_metrics"])

        # Jika ditemukan entri-entri riwayat, kembalikan sebagai daftar
        return history_entries

    raise HTTPException(status_code=404, detail="History not found")


# metrics

@app.post("/metrics", tags=["Metrics"])
def create_metrics(
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
    realroas: str = Form(...),
    campaign_id: str = Form(...),  # Campaign ID as string
    id_account: str = Form(...),
    id_client: str = Form(...),
):
        # Periksa apakah metrics sudah ada dalam database

        metrics_data = {
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
        "realroas": realroas,
        "campaign_id": campaign_id,  # Use campaign_id as a string
        "id_account": id_account,
        "id_client": id_client,
        "TglInsert": datetime.now().isoformat()
        }
        id = metrics_collection.insert_one(metrics_data).inserted_id
        return {
        "_id": str(id),
        "campaign_id": metrics_data["campaign_id"],
        "id_account": metrics_data["id_account"],
        "id_client": metrics_data["id_client"],
        "TglInsert": metrics_data["TglInsert"]
        }

@app.put("/metrics/{id_metrics}", tags=["Metrics"])
def update_metrics(
    id_metrics: str,
    amountspent: str = Form(None),
    reach: str = Form(None),
    impressions: str = Form(None),
    frequency: str = Form(None),
    rar: str = Form(None),
    cpc: str = Form(None),
    ctr: str = Form(None),
    oclp: str = Form(None),
    cpr: str = Form(None),
    atc: str = Form(None),
    roas: str = Form(None),
    realroas: str = Form(None),
    campaign_id: str = Form(None),
    id_account: str = Form(None),
    id_client: str = Form(None),
):
    id_metrics = ObjectId(id_metrics)
    metric = metrics_collection.find_one({"_id": id_metrics})
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")

    updated_data = {
        "TglUpdate": datetime.now().isoformat()
    }

    # Periksa setiap bidang dan tambahkan ke updated_data jika ada data yang diberikan
    if amountspent is not None:
        updated_data["amountspent"] = amountspent
    if reach is not None:
        updated_data["reach"] = reach
    if impressions is not None:
        updated_data["impressions"] = impressions
    if frequency is not None:
        updated_data["frequency"] = frequency
    if rar is not None:
        updated_data["rar"] = rar
    if cpc is not None:
        updated_data["cpc"] = cpc
    if ctr is not None:
        updated_data["ctr"] = ctr
    if oclp is not None:
        updated_data["oclp"] = oclp
    if cpr is not None:
        updated_data["cpr"] = cpr
    if atc is not None:
        updated_data["atc"] = atc
    if roas is not None:
        updated_data["roas"] = roas
    if realroas is not None:
        updated_data["realroas"] = realroas
    if campaign_id is not None:
        updated_data["campaign_id"] = campaign_id
    if id_account is not None:
        updated_data["id_account"] = id_account
    if id_client is not None:
        updated_data["id_client"] = id_client

    # Simpan perubahan dalam entri history_collection
    history_data = {
        "id_metrics": id_metrics,
        "perubahan": updated_data
    }
    history_collection.insert_one(history_data)

    # Update data metrics di metrics_collection
    metrics_collection.update_one({"_id": id_metrics}, {"$set": updated_data})

    return {
        "_id": str(id_metrics),
        "campaign_id": updated_data.get("campaign_id"),
        "id_account": updated_data.get("id_account"),
        "id_client": updated_data.get("id_client"),
        "TglUpdate": updated_data["TglUpdate"]
    }


@app.get("/metrics", tags=["Metrics"])
def get_all_metrics():
    # Ambil semua data metrik dari database
    metrics_list = list(metrics_collection.find())

    formatted_metrics = []
    for metric in metrics_list:
        campaign_id = metric.get("campaign_id")
        campaign_name = None
        campaign_status = None
        campaign_platform = None
        campaign_startdate = None
    
        if campaign_id:
            campaign = campaigns_collection.find_one({"_id": ObjectId(campaign_id)})
            if campaign:
                campaign_name = campaign.get("name")
                campaign_status = campaign.get("status")
                campaign_platform = campaign.get("platform" )
                campaign_startdate = campaign.get("startdate" )

        formatted_metric = {
            "_id": str(metric["_id"]),
            "campaign_id": campaign_id,
            "campaign_name": campaign_name,
            "campaign_platform": campaign_platform,
            "campaign_status": campaign_status,
            "campaign_startdate": campaign_startdate,
            "amountspent": metric.get("amountspent"),
            "reach": metric.get("reach"),
            "impressions": metric.get("impressions"),
            "frequency": metric.get("frequency"),
            "rar": metric.get("rar"),
            "cpc": metric.get("cpc"),
            "ctr": metric.get("ctr"),
            "oclp": metric.get("oclp"),
            "cpr": metric.get("cpr"),
            "atc": metric.get("atc"),
            "roas": metric.get("roas"),
            "realroas": metric.get("realroas"),
            "TglInsert": metric.get("TglInsert"),
        }
        formatted_metrics.append(formatted_metric)

    return formatted_metrics

# Rekomendasi nilai
RECOMMENDED_CTR = "1,5%"
RECOMMENDED_OCLP = "80%"
RECOMMENDED_ROAS = "3.0x"
RECOMMENDED_CPR = "Rp 5.000"
RECOMMENDED_CPC = "Rp 1.000"

@app.put("/setting/metrics/{id_metrics}", tags=["Metrics"])
def update_metrics(
    id_metrics: str,
    CTR: str = Form(None, description="Click-Through Rate (CTR), Recommended value > 1,5%"),
    OCLP: str = Form(None, description="Optimized Cost per Landing Page View (OCLP), Recommended value > 80%"),
    ROAS: str = Form(None, description="Return on Ad Spend (ROAS), Recommended value > 3.0x"),
    CPR: str = Form(None, description="Cost per Result (CPR), Recommended value > Rp 5,000"),
    CPC: str = Form(None, description="Cost Per Click (CPC), Recommended value > Rp 1,000"),
):
    # Periksa apakah id_metrics ada dalam koleksi metrik di MongoDB
    existing_metrics = metrics_collection.find_one({"_id": ObjectId(id_metrics)})
    if not existing_metrics:
        raise HTTPException(status_code=404, detail="Metric ID tidak ditemukan")

    # Validasi CTR
    if CTR is not None and CTR <= RECOMMENDED_CTR:
        raise HTTPException(status_code=422, detail="CTR harus lebih besar dari 1,5%")

    # Validasi OCLP
    if OCLP is not None and OCLP <= RECOMMENDED_OCLP:
        raise HTTPException(status_code=422, detail="OCLP harus lebih besar dari 80%")

    # Validasi ROAS
    if ROAS is not None and ROAS <= RECOMMENDED_ROAS:
        raise HTTPException(status_code=422, detail="ROAS harus lebih besar dari 3.0x")

    # Validasi CPR
    if CPR is not None and CPR <= RECOMMENDED_CPR:
        raise HTTPException(status_code=422, detail="CPR harus lebih besar dari Rp 5.000")

    # Validasi CPC
    if CPC is not None and CPC <= RECOMMENDED_CPC:
        raise HTTPException(status_code=422, detail="CPC harus lebih besar dari Rp 1.000")

    # Buat objek yang akan diupdate
    update_data = {}
    if CTR is not None:
        update_data["CTR"] = CTR
    if OCLP is not None:
        update_data["OCLP"] = OCLP
    if ROAS is not None:
        update_data["ROAS"] = ROAS
    if CPR is not None:
        update_data["CPR"] = CPR
    if CPC is not None:
        update_data["CPC"] = CPC

    # Perbarui data metrik jika ada nilai yang baru diberikan
    if update_data:
        metrics_collection.update_one({"_id": ObjectId(id_metrics)}, {"$set": update_data})

    return {"message": "Data metrik telah diperbarui"}


@app.delete("/metrics/{id}", tags=["Metrics"], dependencies=[Depends(get_current_user)])
async def delete_metrics_by_id(id: str, roles: str = Depends(get_current_user)):
    # Decode the URL-encoded parameter
    if "admin" in roles:
        decoded_id = unquote(id)

        # Now you can use the decoded "id" parameter in your database query
        metrics = metrics_collection.find_one({"_id": ObjectId(decoded_id)})
        if metrics is None:
            raise HTTPException(status_code=404, detail="Metrics tidak ditemukan")
        
        metrics_collection.delete_one({"_id": ObjectId(decoded_id)})
        return {"Metrics dihapus": str(metrics["_id"])}
    else:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.get("/metricslastyear")
async def get_metrics():
    # Hitung tanggal 1 tahun yang lalu dari tanggal sekarang
    one_year_ago = datetime.now() - timedelta(days=365)

    # Query database untuk mendapatkan data metrics dari 1 tahun yang lalu hingga sekarang
    metrics_last_year = list(metrics_collection.find({"date": {"$gte": one_year_ago.isoformat()}}))

    return metrics_last_year

@app.get("/metricslastmonth")
async def get_metrics():
    # Hitung tanggal 1 bulan yang lalu dari tanggal sekarang
    one_month_ago = datetime.now() - timedelta(days=30)

    # Query database untuk mendapatkan data metrics dari 1 bulan yang lalu hingga sekarang
    metrics_last_month = list(metrics_collection.find({"date": {"$gte": one_month_ago.isoformat()}}))

    return metrics_last_month


#campaignssssssssssssssssssssssssssssssssss

@app.post("/campaigns", tags=["Campaigns"])
def create_campaigns(
    name: str = Form(...),
    id_client: str = Form(None),
    id_account: str = Form(None),
    objective: int = Form(...),
    client: str = Form(...),
    account: str = Form(...),
    platform: int = Form(...),
    startdate: str = Form(...), 
    enddate: str = Form(...),
    notes: str = Form(...),
    status: int = Form(...),
):
    campaigns = {
        "name": name,
        "id_client": id_client,
        "id_account": id_account,
        "objective": objective,
        "client": client,
        "account": account,
        "platform": platform,
        "startdate": startdate,
        "enddate": enddate,
        "notes": notes,
        "status": status,
    }

    id = campaigns_collection.insert_one(campaigns).inserted_id
    return {
        "_id": str(id),
        "name": campaigns["name"],
        "id_client": campaigns["id_client"],
        "id_account": campaigns["id_account"],
        "objective": campaigns["objective"],
        "client": campaigns["client"],
        "account": campaigns["account"],
        "platform": campaigns["platform"],
        "startdate": campaigns["startdate"],
        "enddate": campaigns["enddate"],
        "notes": campaigns["notes"],
        "status": campaigns["status"],
    }

@app.put("/campaigns/{campaign_id}", tags=["Campaigns"])
def update_campaign(
    campaign_id: str,
    name: str = Form(None),
    id_client: str = Form(None),
    id_account: str = Form(None),
    objective: int = Form(None),
    client: str = Form(None),
    account: str = Form(None),
    platform: int = Form(None),
    startdate: str = Form(None),  # Changed type to str
    enddate: str = Form(None),    # Changed type to str
    notes: str = Form(None),
    status: int = Form(None),
):
    # Periksa apakah Campaigns ada dalam database
    existing_campaign = campaigns_collection.find_one({"_id": ObjectId(campaign_id)})
    if not existing_campaign:
        raise HTTPException(status_code=404, detail="Campaigns tidak ditemukan")

    # Update data Campaigns jika nilai yang baru diberikan
    update_data = {}
    if name is not None:
        update_data["name"] = name
    if id_client is not None:
        update_data["id_client"] = id_client
    if id_account is not None:
        update_data["id_account"] = id_account

    if objective is not None:
        update_data["objective"] = objective

    if client is not None:
        update_data["client"] = client

    if account is not None:
        update_data["account"] = account

    if platform is not None:
        update_data["platform"] = platform

    if startdate is not None:
        update_data["startdate"] = startdate

    if enddate is not None:
        update_data["enddate"] = enddate

    if notes is not None:
        update_data["notes"] = notes

    if status is not None:
        update_data["status"] = status

    # Lakukan pembaruan data jika ada data yang harus diperbarui
    if update_data:
        campaigns_collection.update_one({"_id": ObjectId(campaign_id)}, {"$set": update_data})

    return {"message": "Data Campaigns telah diperbarui"}

@app.delete("/campaigns/{id}", tags=["Campaigns"], dependencies=[Depends(get_current_user)])
async def delete_campaign(id: str, roles: str = Depends(get_current_user)):
    # Decode the URL-encoded parameter
    if "admin" in roles:
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
def get_campaigns(id: str, roles: list = Depends(get_current_user)):
    if "staff" in roles or "admin" in roles:
        # Decode the URL-encoded parameter
        decoded_id = unquote(id)

        # Now you can use the decoded "id" parameter in your database query
        campaigns = campaigns_collection.find_one({"_id": ObjectId(decoded_id)})
        
        if campaigns is None:
            raise HTTPException(status_code=404, detail="Campaigns tidak ditemukan")
        
        return {
            "_id": str(campaigns["_id"]),
            "name": campaigns["name"],
            "id_client": campaigns.get("id_client", None),
            "id_account": campaigns.get("id_account", None),
            "objective": campaigns["objective"],
            "client": campaigns["client"],
            "account": campaigns["account"],
            "platform": campaigns["platform"],
            "startdate": campaigns["startdate"],
            "enddate": campaigns["enddate"],
            "notes": campaigns.get("notes", ""),
            "status": campaigns["status"],
        }
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.get("/campaigns", tags=["Campaigns"])
def get_all_campaigns(roles: list = Depends(get_current_user)):
    if "staff" in roles or "admin" in roles:
        # Retrieve a list of campaigns from the database
        campaigns_list = list(campaigns_collection.find())
        
        # Transform the campaigns into the desired format
        formatted_campaigns = []
        for campaign in campaigns_list:
            formatted_campaign = {
                "_id": str(campaign["_id"]),
                "name": campaign["name"],
                "id_client": campaign.get("id_client", None),
                "id_account": campaign.get("id_account", None),
                "objective": campaign["objective"],
                "client": campaign["client"],
                "account": campaign["account"],
                "platform": campaign["platform"],
                "startdate": campaign["startdate"],
                "enddate": campaign["enddate"],
                "notes": campaign.get("notes", ""),
                "status": campaign["status"],
            }
            formatted_campaigns.append(formatted_campaign)
        
        return formatted_campaigns
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

#accountttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt

@app.post("/accounts", tags=["Accounts"], dependencies=[Depends(get_current_user)])
def create_accounts(
    name: str = Form(...),
    id_client: str = Form(None),
    client: str = Form(...),
    platform: int = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    notes: str = Form(...),
    status: int = Form(...),
    roles: str = Depends(get_current_user)
):
    if "admin" in roles:
        # Check if an account with the same name already exists
        existing_account = accounts_collection.find_one({"name": name})
        if existing_account:
            raise HTTPException(status_code=400, detail="Account already exists in the database")

        # If the account doesn't exist, proceed to create it
        account = {
            "name": name,
            "id_client": id_client,
            "client": client,
            "platform": platform,
            "email": email,
            "password": password,
            "notes": notes,
            "status": status,
        }
        id = accounts_collection.insert_one(account).inserted_id
        return {
            "_id": str(id),
            "name": account["name"],
            "id_client": account["id_client"],
            "client": account["client"],
            "platform": account["platform"],
            "email": account["email"],
            "password": account["password"],
            "notes": account["notes"],
            "status": account["status"],
        }
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.put("/accounts/{account_id}", tags=["Accounts"], dependencies=[Depends(get_current_user)])
def update_account(
    account_id: str,
    name: str = Form(None),
    id_client: str = Form(None),
    client: str = Form(None),
    platform: int = Form(None),
    email: str = Form(None),
    password: str = Form(None),
    notes: str = Form(None),
    status: int = Form(None),
    roles: str = Depends(get_current_user)
):
    if "admin" in roles:
        # Periksa apakah accounts ada dalam database
        existing_account = accounts_collection.find_one({"_id": ObjectId(account_id)})
        if not existing_account:
            raise HTTPException(status_code=404, detail="accounts tidak ditemukan")

        # Update data accounts jika nilai yang baru diberikan
        update_data = {}
        if name is not None:
            update_data["name"] = name
        if id_client is not None:
            update_data["id_client"] = id_client
        if client is not None:
            update_data["client"] = client
        if platform is not None:
            update_data["platform"] = platform
        if email is not None:
            update_data["email"] = email
        if password is not None:
            update_data["password"] = password
        if notes is not None:
            update_data["notes"] = notes
        if status is not None:
            update_data["status"] = status

        # Lakukan pembaruan data jika ada data yang harus diperbarui
        if update_data:
            accounts_collection.update_one({"_id": ObjectId(account_id)}, {"$set": update_data})

        return {"message": "Data accounts telah diperbarui"}

    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.delete("/accounts/{id}", tags=["Accounts"], dependencies=[Depends(get_current_user)])
def delete_accounts(id: str, roles: str = Depends(get_current_user)):
    # Decode the URL-encoded parameter
    if "admin" in roles:
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
def get_all_accounts(roles: list = Depends(get_current_user)):
    if "staff" in roles or "admin" in roles:
        # Implementasi endpoint tanpa dependensi
        accounts = list(accounts_collection.find())

        # Mengubah format ObjectId ke string untuk respons
        for account in accounts:
            account["_id"] = str(account["_id"])

            # Menggunakan .get() untuk id_client dengan default None
            id_client = account.get("id_client", None)
            account["id_client"] = id_client

        return accounts
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.get("/accounts/{id}", tags=["Accounts"])
def get_account(id: str, roles: list = Depends(get_current_user)):
    if "staff" in roles or "admin" in roles:
        # Decode the URL-encoded parameter
        decoded_id = unquote(id)

        # Now you can use the decoded "id" parameter in your database query
        account = accounts_collection.find_one({"_id": ObjectId(decoded_id)})
        
        if account is None:
            raise HTTPException(status_code=404, detail="Account tidak ditemukan")
        
        # Mengubah format ObjectId ke string untuk respons
        account["_id"] = str(account["_id"])

        # Menggunakan .get() untuk id_client dengan default None
        id_client = account.get("id_client", None)

        # Mengembalikan respons
        return {
            "_id": account["_id"],
            "name": account["name"],
            "id_client": id_client,
            "client": account["client"],
            "platform": account["platform"],
            "email": account["email"],
            "password": account["password"],
            "notes": account["notes"],
            "status": account["status"],
        }
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

#clientssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss

@app.post("/clients", tags=["Clients"], dependencies=[Depends(get_current_user)])
def create_clients(name: str = Form(...),
    address: str = Form(...),
    contact: str = Form(...),
    notes: str = Form(...),
    status: int = Form(...),
    roles: str = Depends(get_current_user)):
    if "admin" in roles:
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
        }
        id = clients_collection.insert_one(clients_data).inserted_id
        return {
        "_id": str(id),
        "name": clients_data["name"],
        "address": clients_data["address"],
        "contact": clients_data["contact"],
        "notes": clients_data["notes"],
        "status": clients_data["status"],
        }

    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.put("/clients/{client_id}", tags=["Clients"], dependencies=[Depends(get_current_user)])
def update_clients(
    client_id: str,
    name: str = Form(None),
    address: str = Form(None),
    contact: str = Form(None),
    notes: str = Form(None),
    status: int = Form(None),
    roles: str = Depends(get_current_user)
):
    if "admin" in roles:
        # Periksa apakah Clients ada dalam database
        existing_clients = clients_collection.find_one({"_id": ObjectId(client_id)})
        if not existing_clients:
            raise HTTPException(status_code=404, detail="Clients tidak ditemukan")

        # Update data Clients jika nilai yang baru diberikan
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

        # Lakukan pembaruan data jika ada data yang harus diperbarui
        if update_data:
            clients_collection.update_one({"_id": ObjectId(client_id)}, {"$set": update_data})

        return {"message": "Data klien telah diperbarui"}

    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.delete("/clients/{id}", tags=["Clients"], dependencies=[Depends(get_current_user)])
def delete_clients(id: str, roles: str = Depends(get_current_user)):
    # Decode the URL-encoded parameter
    if "admin" in roles:
        decoded_id = unquote(id)

        # Now you can use the decoded "id" parameter in your database query
        clients = clients_collection.find_one({"_id": ObjectId(decoded_id)})
        if clients is None:
            raise HTTPException(status_code=404, detail="Clients tidak ditemukan")
        
        clients_collection.delete_one({"_id": ObjectId(decoded_id)})
        return {"Clients dihapus": str(clients["_id"])}
    else:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")
    
@app.get("/clients/{id}", tags=["Clients"])
def get_client_by_id(id: str, roles: list = Depends(get_current_user)):
    if "staff" in roles or "admin" in roles:
        decoded_id = unquote(id)

        # Mencari klien berdasarkan ID
        client = clients_collection.find_one({"_id": ObjectId(decoded_id)})

        if client is None:
            raise HTTPException(status_code=404, detail="Klien tidak ditemukan")

        return {
            "_id": str(client["_id"]),
            "name": client["name"],
            "address": client["address"],
            "contact": client["contact"],
            "notes": client["notes"],
            "status": client["status"],
        }
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

@app.get("/clients", tags=["Clients"])
def get_all_clients(roles: list = Depends(get_current_user)):
    if "staff" in roles or "admin" in roles:
        # Implementasi endpoint tanpa dependensi
        clients = list(clients_collection.find())

        # Mengubah format ObjectId ke string untuk respons
        for client in clients:
            client["_id"] = str(client["_id"])

        return clients
    else:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki izin untuk mengakses endpoint ini")

if __name__ == "__main__":
    app.run(debug=True)
