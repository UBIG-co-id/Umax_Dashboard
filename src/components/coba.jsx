<Menu as="div" className="relative ml-3 right-20">
<div>
  <Menu.Button
  onClick={() => setOpenProfileMenu(!openProfileMenu)}
  className="relative flex rounded-full  text-sm">
    <span className="absolute -inset-1.5" />

    {/* <LazyLoad height={200} offset={100}> */}
    <div className="rounded-full flex  border-black/10 bg-black/10 p-1">
      {profileData.image ? (
        <img
          className="h-8  w-8 object-cover rounded-full"
          src={`data:image/jpeg;base64,${profileData.image}`}
          alt="profile"
        />
      ) : (
        <img
          className="h-8 w-8 object-cover rounded-full"
          src={defaultProfile}
          alt="profile"
        />
      )}

      <span className="absolute left-12 bottom-[3px] leading-5 flex-col font-medium flex items-start text-gray-800">
        {profileData.nama}
        <a className="font-normal text-xs text-gray-700">
          Admin
        </a>
      </span>
    </div>

  </Menu.Button>
</div>
<Transition
  as={Fragment}
  enter="transition ease-out duration-100"
  enterFrom="transform opacity-0 scale-95"
  enterTo="transform opacity-100 scale-100"
  leave="transition ease-in duration-75"
  leaveFrom="transform opacity-100 scale-100"
  leaveTo="transform opacity-0 scale-95"
>
  <Menu.Items className="absolute -left-16 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        style={{ display: openProfileMenu ? "block" : "none" }}

  >
    <Menu.Item>
      <a
        className={classNames(
          "bg-slate-500 rounded-t-md block px-4 -mt-1 py-2 text-sm text-white"
        )}
      >
        Hallo, {profileData.nama}
      </a>
    </Menu.Item>
    <Menu.Item>
      {({ active }) => (
        <a
          href="#"
          onClick={profilePage}
          className={classNames(
            active ? "bg-gray-100" : "",
            "flex items-center px-4 py-2 text-sm text-gray-700  "
          )}
        >
          <AiOutlineUser className="mr-2" /> Profile
        </a>
      )}
    </Menu.Item>
    <Menu.Item>
      
{({ active }) => (
<div className="relative">
<button
onClick={() => setOpenSubMenu(!openSubMenu)}
className={classNames(
active ? "bg-gray-100" : "",
"flex items-center w-full px-4 py-2 text-sm text-gray-700"
)}
>
<CiSettings className="mr-2" />
Settings
</button>

{/* Submenu untuk Settings */}
{openSubMenu && (
<Menu.Items className="absolute right-48 z-50 mt-2 w-48 top-0 border rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
<Menu.Item>
<a
href="#"
onClick={(e) => {
e.preventDefault(); 
}}
className={classNames(
"block px-4 py-2 text-sm text-gray-700"
)}
>
Submenu Item 1
</a>
</Menu.Item>
<Menu.Item>
<a
href="#"
onClick={(e) => {
e.preventDefault(); // Menghentikan peristiwa default agar submenu tidak tertutup
// Tambahkan logika lain yang diperlukan
}}
className={classNames(
"block px-4 py-2 text-sm text-gray-700"
)}
>
Submenu Item 2
</a>
</Menu.Item>
{/* Tambahkan submenu sesuai kebutuhan */}
</Menu.Items>
)}
</div>
)}
</Menu.Item>

          <hr className="border-gray-500 " />
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={handleSignOut}
          className={classNames(
            active ? "bg-gray-100" : "",
            "flex items-center w-full px-4 py-2 text-sm text-gray-700"
          )}
        >
          <BiLogOut className="mr-2" /> Sign out
        </button>
      )}
    </Menu.Item>
  </Menu.Items>
</Transition>
</Menu>