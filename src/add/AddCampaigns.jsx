import React, { useState, useEffect, useRef, useMemo } from "react";
import Navbar from "../components/Navbar";
import CampaignTable from "../components/CampaignTable";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios from 'axios';
import Select from 'react-select';



const AddCampaigns = () => {
  // / URL BASE
  const umaxUrl = "https://umaxxnew-1-d6861606.deta.app/";

  const navigate = useNavigate();

  // GET LIST ACCOUNT
  const [data, setData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const apiUrl = `${umaxUrl}account-by-tenant`;

      const response = await Axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setData(response.data.Data);
      console.log('Response Account:', response.data);
    } catch (error) {
      console.error('Error saat mengambil data:', error.message);
    }
  };

  fetchData();
}, []);
// end

  // ADD Data Campaigns
  const formik = useFormik({
    initialValues: {
      name: "",
      account_id: "",
      objective: "",
      start_date: "",
      end_date: "",
      status: "",
      notes: "",
    },

    onSubmit: (values) => {
      const token = localStorage.getItem("jwtToken");
      if (
        values.name &&
        values.account_id &&
        values.objective &&
        values.start_date &&
        values.end_date &&
        values.status &&
        values.notes
    ) {
      
      fetch(`${umaxUrl}campaign-create`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams(values).toString(),
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          if (data && data.success) {
            toast.success('Data added successfully!', {
              position: toast.POSITION.TOP_CENTER,
            });
            navigate('/Accounts');
          } else {
            // Menampilkan toast ketika data berhasil ditambah
            toast.success('Data added successfully!', {
              position: 'top-right',
            });
            // navigate('/Accounts');
          }
      })
      .catch(error => {
        console.error(error);
        toast.error('Terjadi kesalahan. Silakan coba lagi nanti.', {
          position: 'top-right',
        });
      }); 
    } else {
      toast.warning('Silakan isi semua field yang wajib diisi.', {
          position: 'top-right',
      });
    }
  },
});
// 
  // END ADD DATA Campaigns

  // close menggunakan esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        console.log("Esc key pressed");
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
  // END

  // option select v2
  const options = data.map(item => ({
    value: item._id, 
    label: item.username,
  }));

// style select v2
const customStyles = {
  control: provided => ({
    ...provided,
    boxShadow: 'none',
    backgroundColor: '#f2f6faff',
    border: '1px solid #cad4e0ff',
    borderRadius: '6px',
  }),
  container: provided => ({
    ...provided,
    height: '50px',
    width: '200px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#4CAF500' : '#fff', 
    color: state.isSelected ? '#242424' : '#000', 
  }),
  menu: provided => ({
    ...provided,
    zIndex: 999, 
    border: '2px solid #eee',
    maxHeight: '200px', 
    overflowY: 'hidden',
  }),
};

  // RENDER UI
  return (
    <main className="bg-slate-100 min-h-screen">
      <div>
        <Navbar />
        <div className="bg-white min-h-[100vh] w-auto m-2 border rounded-lg">
          <span className="p-10 relative top-4 text-gray-600 font-medium text-2xl">
            Campaigns
          </span>
          <CampaignTable />
        </div>
        <div className="fixed z-50 inset-0 flex items-center justify-center">
          <div className="fixed -z-10 inset-0 bg-black bg-opacity-50"></div>
          <form
            onSubmit={formik.handleSubmit}
            className=" bg-white p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Campaign</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  <span className="text-red-600 text-lg">*</span>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="p-2 h-9 w-full border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  <span className="text-red-600 text-lg">*</span>
                  Objective
                </label>
                <select
                  name="objective"
                  id="objective"
                  onChange={formik.handleChange}
                  value={formik.values.objective}
                  className="px-3 text-slate-500 h-9 w-full border  focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                >
                  <option hidden>-Select Objective-</option>
                  <option value="1">Awareness</option>
                  <option value="2">Conversion</option>
                  <option value="3">Consideration</option>
                </select>
              </div>
            </div>
            

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm">
                  <span className="text-red-600 text-lg">*</span>
                  Account
                </label>
                <Select
                 name="account_id"
                 id="account_id"
                 options={options}
                 styles={customStyles}
                 onChange={selectedOption => formik.setFieldValue("account_id", selectedOption.value)}  
                 value={options.find(option => option.value === formik.values.account_id)}
                  className=" text-slate-500 h-9 w-full  focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                >
                 <option hidden>-Select Account-</option>
                    {options.map(account => (
                      <option key={account.value} value={account.value}>
                        {account.label}
                      </option>
                    ))}
                </Select>
              </div>

              <div className="flex flex-col">
                <label className="pb-2 text-sm" htmlFor="start_date">
                  <span className="text-red-600 text-lg">*</span>
                  Start Date
                </label>
                <DatePicker
                  id="start_date"
                  name="start_date"
                  placeholderText="dd/mm/yyyy"
                  selected={
                    formik.values.start_date
                      ? new Date(formik.values.start_date)
                      : null
                  }
                  onChange={(date) => {
                    formik.setFieldValue(
                      "start_date",
                      date ? date.toISOString().split("T")[0] : "" // Mengubah ke format YYYY-MM-DD
                    );
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="p-2 h-9 select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="end_date">
                  <span className="text-red-600 text-lg">*</span>
                  End Date
                </label>
                <DatePicker
                  id="end_date"
                  name="end_date"
                  placeholderText="dd/mm/yyyy"
                  selected={
                    formik.values.end_date
                      ? new Date(formik.values.end_date)
                      : null
                  }
                  onChange={(date) => {
                    formik.setFieldValue(
                      "end_date",
                      date ? date.toISOString().split("T")[0] : "" // Mengubah ke format YYYY-MM-DD
                    );
                  }}
                  dateFormat="dd/MM/yyyy"
                  className="p-2 h-9 select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  <span className="text-red-600 text-lg">*</span>
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  onChange={formik.handleChange}
                  value={formik.values.status}
                  className="px-3 text-slate-500 h-9 w-full border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md select-custom-width"
                >
                  <option hidden>-Select Status-</option>
                  <option value="1">Active</option>
                  <option value="2">Draft</option>
                  <option value="3">Complated</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex flex-col">
                <label className="pb-2 text-sm " htmlFor="">
                  <span className="text-red-600 text-lg">*</span>
                  Notes
                </label>
                <textarea
                  type="text"
                  name="notes"
                  id="notes"
                  onChange={formik.handleChange}
                  value={formik.values.notes}
                  className="p-2 max-h-md select-custom-width text-slate-500 border focus:border-blue-500 focus:outline-none  focus:border-2 bg-slate-100 border-slate-300 rounded-md"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              {/* Tombol Save */}
              {/* <button

                            className="bg-red-200 hover:bg-red-300 text-red-600 py-1 px-1 rounded"
                            >
                            <BsTrash3 />
                            </button> */}

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-gray-500 mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddCampaigns;
