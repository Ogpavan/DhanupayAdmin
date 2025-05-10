import React, { useEffect, useState } from 'react';
import { useLoader } from '../context/LoaderContext.jsx';
import { Buildings, ChartBar, CurrencyDollar, Users } from 'phosphor-react';
import Swal from 'sweetalert2'; // SweetAlert library for alerts
import { fetchStatesList } from '../api/stateListApi.js';
import { fetchCitiesByState } from "../api/CityListApi.js";
import { PencilSimple, Trash } from 'phosphor-react';
import StateTable from './Tables/StateTable.jsx';
import CityTable from './Tables/CityTable.jsx';
import { fetchDepartmentList } from '../api/DepartmentListApi.js';
import DepartmentTable from './Tables/DepartmentTable.jsx';
import DesingnationTable from '../AdminPages/Tables/DesingnationTable.jsx';
import { fetchdesingnationList } from '../api/desingnationListApi .js';
import Cookies from 'js-cookie';
import { fetchUserTypeList } from '../api/FetchUserTypeList.jsx';
import UserTypeTable from './Tables/UserTypeTable.jsx';
import RoleTable from './Tables/RoleTable.jsx';
import { fetchRoleList } from '../api/RoleList.jsx';



function BasicSettings() {

  const token = Cookies.get("token");
  const userId = Cookies.get("UserId");
  const { showLoader, hideLoader } = useLoader();

  // Dummy data to simulate API response
  const dummyData = [
    {
      title: 'States',
      description: 'Manage States',
      icon: ChartBar,
    },
    {
      title: 'Cities',
      description: 'Manage Cities',
      icon: Buildings,
    },
    {
      title: 'Departments',
      description: 'Manage Departments',
      icon: Users,
    },
    {
      title: 'Designation',
      description: 'Manage Designation',
      icon: Users,
    },
    {
      title: 'User Type',
      description: 'Manage User Types',
      icon: Users,
    },
    {
      title: 'Role',
      description: 'Manage Roles',
      icon: Users,
    },
  ];

  const [settingsData, setSettingsData] = useState([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false); // To toggle password change form visibility
  const [oldPassword, setOldPassword] = useState('');
  const [addState, setaddState] = useState('');
  const [addCity, setaddCity] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [modalVisible, setModalVisible] = useState(null); // Track which modal is visible
  //storing states for dropdown in city api call
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  //for storing city list of selected state
  const [cities, setCities] = useState([]);
  //for storing departmetns
  const [Department, setDepartment] = useState([]);
  const [DepartmentDesc, setDepartmentDesc] = useState([]);
  const [Departmentlist, setDepartmentlist] = useState('');

  //for storing desingnation
  const [desingnation, setdesingnation] = useState([]);
  const [desingnationDesc, setdesingnationDesc] = useState([]);
  const [desingnationlist, setdesingnationlist] = useState('');

  //for storing UserType
  const [UserType, setUserType] = useState([]);
  const [UserTypeDesc, setUserTypeDesc] = useState('');
  const [UserTypelist, setUserTypelist] = useState([]);

  //for storing Role
  const [Role, setRole] = useState([]);
  const [RoleDesc, setRoleDesc] = useState('');
  const [Rolelist, setRolelist] = useState([]);

  const [userTypes, setuserTypes] = useState([]);
  const [selectedUserType, setselectedUserType] = useState('');

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      setSettingsData(dummyData);
      hideLoader();
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  //for fetching cities list
  useEffect(() => {
    const shouldFetchCities =
      modalVisible !== null &&
      settingsData?.[modalVisible]?.title === 'Cities' &&
      selectedState;

    if (shouldFetchCities) {
      const getCities = async () => {
        try {
          setLoading(true);
          const cityData = await fetchCitiesByState(selectedState);
          setCities(cityData);
        } catch (error) {
          console.error("Failed to fetch cities", error);
          // Optionally set error state
        } finally {
          setLoading(false);
        }
      };

      getCities();
    }
  }, [modalVisible, selectedState, settingsData]);


  // for fething states list for city creation api
  useEffect(() => {
    const fetchStates = async () => {
      if (modalVisible !== null) {
        try {
          const data = await fetchStatesList();
          console.log("State list", data);
          setStates(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchStates();
  }, [modalVisible, loading]);


  // for fething states list for city creation api
  useEffect(() => {
    const fetchRoles = async () => {
      if (modalVisible !== null) {
        try {
          const data = await fetchRoleList();
          console.log("Role list", data);
          setRolelist(data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    fetchRoles();
  }, [modalVisible, loading]);



  //handle State edit
  const handlestateEdit = async (state) => {
    // const userId = localStorage.getItem('userId');
    // const token = localStorage.getItem('token');

    if (!userId || !token) {
      Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
      return;
    }
    const { value: newStateName } = await Swal.fire({
      title: 'Enter New State Name',
      input: 'text',
      inputValue: state.StateName,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'State name cannot be empty!';
        }
      }
    });

    if (newStateName) {

      const requestData = {
        userId: parseInt(userId),
        stateId: state.StateId,
        stateName: newStateName
      };

      try {
        // Make the API call to update the state
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/state/update`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok && result.success) {

          Swal.fire('Success!', result.message, 'success');

        } else {

          Swal.fire('Error', result.message || 'Failed to update state.', 'error');
        }
      } catch (error) {

        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
      }
    }
  };

  //handle city delete
  const handleCityEdit = async (city) => {
    // const userId = localStorage.getItem('userId');
    // const token = localStorage.getItem('token');

    if (!userId || !token) {
      Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
      return;
    }
    const { value: newCityName } = await Swal.fire({
      title: 'Enter New City Name',
      input: 'text',
      inputValue: city.CityName,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'City name cannot be empty!';
        }
      }
    });

    if (newCityName) {
      const requestData = {
        userId: parseInt(userId),
        cityId: city.CityId,
        cityName: newCityName
      };
      console.log(requestData);

      try {
        // Make the API call to update the city
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/city/update`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok && result.success) {

          Swal.fire('Success!', result.message, 'success');

        } else {

          Swal.fire('Error', result.message || 'Failed to update city.', 'error');
        }
      } catch (error) {

        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
      }
    }
  };


  // the handlel delete state 
  const handlestateDelete = async (stateId) => {
    console.log("Delete state with ID:", stateId);
    console.log("Delete user id:", userId);


    // Implement API call to delete state
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/state/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "userId": userId,
          "stateId": stateId
        })
      });
      const result = await response.json();
      // console.log(result)
      if (result.success) {
        // Successfully deleted the state, maybe refetch data or show a success message
        // Swal.fire('Success', 'State deleted successfully!', 'success');
        // Optionally refetch the states list after deletion
      } else {
        // console.log(result)
        // Swal.fire('Error', result, 'error');
      }
    } catch (error) {
      console.error('Error deleting state:', error);
      Swal.fire('Error', 'An error occurred while deleting the state', 'error');
    }
  };

  //city delete handle
  const handlecityDelete = async (cityId) => {
    console.log("Delete state with ID:", cityId);
    console.log("Delete user id:", userId);
    // Implement API call to delete state
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/city/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId: parseInt(userId),
          CityId: parseInt(cityId)
        })
      });
      const result = await response.json();
      console.log(result)
    } catch (error) {
      console.error('Error deleting state:', error);
      Swal.fire('Error', 'An error occurred while deleting the state', 'error');
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmNewPassword) {
      Swal.fire('Error', 'New passwords do not match!', 'error');
      return;
    }

    setLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      // Assuming the API call was successful
      Swal.fire('Success', 'Password updated successfully!', 'success');
      setModalVisible(null); // Close the modal after password update
    }, 2000); // Simulate network delay
  };



  // handle department CRUD Operation start
  // ***************************************************************************************
  const handleDepartmentCreate = async () => {
    setLoading(true);
    // const token = localStorage.getItem("token");
    // const userId = localStorage.getItem("userId");
    console.log(token, userId);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/department/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({
          "userId": userId,
          "DepartmentName": Department,
          "DepartmentDescription": DepartmentDesc
        })



      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Success', JSON.stringify(data.message), 'success');
        setDepartment([]);
        setDepartmentDesc([]);
        // Maybe close the modal
        setModalVisible(null);
      } else {
        // Handle login failure
        Swal.fire('Error', JSON.stringify(data?.message) || 'Failed to create state', 'error');
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire('Error', JSON.stringify(error) || error.message || error || 'An error occurred during login.', 'error');
    } finally {
      setaddState('');
      setLoading(false);
    }
  };


  //for fetching department list
  useEffect(() => {
    const fetchDepartments = async () => {
      if (modalVisible !== null) {
        try {
          const data = await fetchDepartmentList();
          console.log(data);
          setDepartmentlist(data);
        } catch (error) {
          console.error('Error fetching department list:', error);
        }
      }
    };

    fetchDepartments();
  }, [modalVisible, loading]);


  //handle department edit/update
  const handleDepartmentEdit = async (department) => {
    if (!userId || !token) {
      Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
      return;
    }
    console.log(department);

    // Prompt the user for the new department name and description
    const { value: departmentData } = await Swal.fire({
      title: 'Enter New Department Details',
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="New Department Name" value="${department.departmentName || ''}" style=" margin-bottom: 10px;">
        <input id="swal-input-description" class="swal2-input" placeholder="New Department Description" value="${department.departmentDescription || ''}" style=" margin-bottom: 10px;">
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value;
        const description = document.getElementById('swal-input-description').value;
        if (!name || !description) {
          Swal.showValidationMessage('Both fields are required!');
          return false;
        }
        return { name, description };
      }
    });

    if (departmentData) {
      const { name, description } = departmentData;
      const requestData = {
        userId: parseInt(userId),
        departmentId: department.DepartmentID,
        departmentName: name,
        departmentDescription: description
      };
      console.log(requestData);

      try {
        setLoading(true);
        // Make the API call to update the department
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/department/update`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setLoading(false);


          Swal.fire('Success!', result.message, 'success');
        } else {
          Swal.fire('Error', result.message || 'Failed to update department.', 'error');
          setLoading(false);
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        setLoading(false);
      }
    }

  };


  //handle department delete

  const handleDepartmentDelete = async (DepartmentID) => {
    setLoading(true);
    console.log("Delete state with ID:", DepartmentID);
    console.log("Delete user id:", userId);
    // Implement API call to delete state
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/department/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId: parseInt(userId),
          DepartmentID: parseInt(DepartmentID)
        })
      });
      const result = await response.json();
      console.log(result)
      if (response.ok && result.success) {
        setLoading(false);
        Swal.fire('Success!', result.message, 'success');
      } else {
        setLoading(false);
        Swal.fire('Error', result.message || 'Failed to delete department.', 'error');
      }

    } catch (error) {
      setLoading(false);
      console.error('Error deleting state:', error);
      Swal.fire('Error', 'An error occurred while deleting the department', 'error');
    }
  };

  //************************************************************************************* */  



  // handle department CRUD Operation end










  // handle desingnation CRUD Operation start
  // ***************************************************************************************
  const handledesingnationCreate = async () => {
    setLoading(true);
    // const token = localStorage.getItem("token");
    // const userId = localStorage.getItem("userId");
    console.log(userId);
    console.log(desingnation);
    console.log(desingnationDesc);
    console.log(token);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/desingnation/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({
          "userId": userId,
          "desingnationName": desingnation,
          "desingnationDescription": desingnationDesc
        })



      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Success', JSON.stringify(data.message), 'success');
        setdesingnation([]);
        setdesingnationDesc([]);
        // Maybe close the modal
        setModalVisible(null);
      } else {
        // Handle login failure
        Swal.fire('Error', JSON.stringify(data?.message) || 'Failed to createdesingnation', 'error');
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire('Error', JSON.stringify(error) || error.message || error || 'An error occurred during login.', 'error');
    } finally {
      setaddState('');
      setLoading(false);
    }
  };


  //for fetching desingnation list
  useEffect(() => {
    const fetchdesingnation = async () => {
      if (modalVisible !== null) {
        try {
          const data = await fetchdesingnationList();
          console.log(data);
          setdesingnationlist(data);
        } catch (error) {
          console.error('Error fetching desingnation list:', error);
        }
      }
    };

    fetchdesingnation();
  }, [modalVisible, loading]);


  //handle department edit//update
  const handledesingnationEdit = async (desingnation) => {
    if (!userId || !token) {
      Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
      return;
    }
    console.log(desingnation);

    // Prompt the user for the new department name and description
    const { value: desingnationData } = await Swal.fire({
      title: 'Enter New Designation Details',
      html: `
        <input id="swal-input-desingnationname" class="swal2-input" placeholder="New Designation Name" value="${desingnation.DesignationName || ''}" style=" margin-bottom: 10px;">
        <input id="swal-input-desingnationdescription" class="swal2-input" placeholder="New Designation Description" value="${desingnation.DesignationDescription || ''}" style=" margin-bottom: 10px;">
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const desingnationname = document.getElementById('swal-input-desingnationname').value;
        const desingnationdescription = document.getElementById('swal-input-desingnationdescription').value;
        if (!desingnationname || !desingnationdescription) {
          Swal.showValidationMessage('Both fields are required!');
          return false;
        }
        return { desingnationname, desingnationdescription };
      }
    });

    if (desingnationData) {
      const { desingnationname, desingnationdescription } = desingnationData;
      const requestData = {
        userId: parseInt(userId),
        desingnationId: desingnation.DesignationID,  // Correct property name
        desingnationName: desingnationname,
        desingnationDescription: desingnationdescription
      };
      console.log(requestData);

      try {
        setLoading(true);
        // Make the API call to update the department
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/desingnation/update`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setLoading(false);
          Swal.fire('Success!', result.message, 'success');
        } else {
          console.log(result);
          Swal.fire('Error', JSON.stringify(result?.message) || result.message || 'Failed to update designation.', 'error');
          setLoading(false);
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        setLoading(false);
      }
    }
  };

  //handle department delete

  const handledesingnationDelete = async (desingnationID) => {
    setLoading(true);
    console.log("Delete state with ID:", desingnationID);
    console.log("Delete user id:", userId);
    // Implement API call to delete state
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/desingnation/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId: parseInt(userId),
          desingnationID: parseInt(desingnationID)
        })
      });
      const result = await response.json();
      console.log(result)
      if (response.ok && result.success) {
        setLoading(false);
        Swal.fire('Success!', result.message, 'success');
      } else {
        setLoading(false);
        Swal.fire('Error', result.message || 'Failed to delete desingnation.', 'error');
      }

    } catch (error) {
      setLoading(false);
      console.error('Error deleting desingnation', error);
      Swal.fire('Error', 'An error occurred while deleting the desingnation', 'error');
    }
  };

  //************************************************************************************* */  



  // handle desingnation CRUD Operation end









  // handle USERtYPE UserType CRUD Operation start
  // ***************************************************************************************
  const handleUserTypeCreate = async () => {
    setLoading(true);
    // const token = localStorage.getItem("token");
    // const userId = localStorage.getItem("userId");
    console.log(token, userId);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/TypeMaster/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({
          "userId": userId,
          "UserTypeName": UserType,
          "UserTypeDescription": UserTypeDesc
        })



      });

      const data = await response.json();
      console.log("usertype Created ", data);

      if (data.success) {
        Swal.fire('Success', JSON.stringify(data.message), 'success');
        setUserType([]);
        setUserTypeDesc([]);
        // Maybe close the modal
        setModalVisible(null);
      } else {
        // Handle login failure
        Swal.fire('Error', JSON.stringify(data?.message) || 'Failed to create state', 'error');
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire('Error', JSON.stringify(error) || error.message || error || 'An error occurred during login.', 'error');
    } finally {
      setaddState('');
      setLoading(false);
    }
  };


  //for fetching Usertype list
  useEffect(() => {
    const fetchUserType = async () => {
      if (modalVisible !== null) {
        try {
          const data = await fetchUserTypeList();
          console.log("UserTpe List", data);
          setUserTypelist(data);
        } catch (error) {
          console.error('Error fetching UserType list:', error);
        }
      }
    };


    fetchUserType();
  }, [modalVisible, loading]);


  //handle UserType edit/update
  const handleUserTypeEdit = async (UserType) => {
    if (!userId || !token) {
      Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
      return;
    }
    console.log(UserType);
      Swal.fire('Error', 'API Under Development', 'error'); 

    // // Prompt the user for the new department name and description
    // const { value: UserTypeData } = await Swal.fire({
    //   title: 'Enter New UserType Details',
    //   html: `
    //     <input id="swal-input-name" class="swal2-input" placeholder="New UserType Name" value="${UserType.UserTypeName || ''}" style=" margin-bottom: 10px;">
    //     <input id="swal-input-description" class="swal2-input" placeholder="New UserType Description" value="${UserType.dUserTypeDescription || ''}" style=" margin-bottom: 10px;">
    //   `,
    //   showCancelButton: true,
    //   confirmButtonText: 'Update',
    //   cancelButtonText: 'Cancel',
    //   preConfirm: () => {
    //     const name = document.getElementById('swal-input-name').value;
    //     const description = document.getElementById('swal-input-description').value;
    //     if (!name || !description) {
    //       Swal.showValidationMessage('Both fields are required!');
    //       return false;
    //     }
    //     return { name, description };
    //   }
    // });

    // if (UserTypeData) {
    //   const { name, description } = UserTypeData;
    //   const requestData = {
    //     userId: parseInt(userId),
    //     UserTypeId: UserType.UserTypeID,
    //     UserTypeName: name,
    //     UserTypeDescription: description
    //   };
    //   console.log(requestData);

    //   try {
    //     setLoading(true);
    //     // Make the API call to update the department
    //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/UserType/update`, {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(requestData)
    //     });

    //     const result = await response.json();

    //     if (response.ok && result.success) {
    //       setLoading(false);


    //       Swal.fire('Success!', result.message, 'success');
    //     } else {
    //       Swal.fire('Error', result.message || 'Failed to update UserType.', 'error');
    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    //     setLoading(false);
    //   }
    // }

  };


  //handle Usertype delete

  const handleUserTypeDelete = async (UserTypeID) => {
    setLoading(true);
    console.log("Delete state with ID:", UserTypeID);
    console.log("Delete user id:", userId);
    Swal.fire('Error', 'API Under Development', 'error'); 
    setLoading(false);


    // Implement API call to delete state
    // try {
    //   const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/UserType/delete`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Content-Type': 'application/json'
    //     },

    //     body: JSON.stringify({
    //       userId: parseInt(userId),
    //       DepartmentID: parseInt(UserTypeID)
    //     })
    //   });
    //   const result = await response.json();
    //   console.log(result)
    //   if (response.ok && result.success) {
    //     setLoading(false);
    //     Swal.fire('Success!', result.message, 'success');
    //   } else {
    //     setLoading(false);
    //     Swal.fire('Error', result.message || 'Failed to delete UserType.', 'error');
    //   }

    // } catch (error) {
    //   setLoading(false);
    //   console.error('Error deleting state:', error);
    //   Swal.fire('Error', 'An error occurred while deleting the UserType', 'error');
    // }
  };

  //************************************************************************************* */  
  // handle USERtYPE CRUD Operation end




  // *****************************************************************
  // handle Role CRUD Operation Staret 


  //handle Role edit
  const handleRoleEdit = async (Role) => {
    // const userId = localStorage.getItem('userId');
    // const token = localStorage.getItem('token');
    console.log("Role", Role)

    if (!userId || !token) {
      Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
      return;
    }
   
    // Prompt the user for the new department name and description
    const { value: UserTypeData } = await Swal.fire({
      title: 'Enter New UserType Details',
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="New UserType Name" value="${Role.RoleName || ''}" style=" margin-bottom: 10px;">
        <input id="swal-input-description" class="swal2-input" placeholder="New UserType Description" value="${Role.RoleDescription || ''}" style=" margin-bottom: 10px;">
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value;
        const description = document.getElementById('swal-input-description').value;
        if (!name || !description) {
          Swal.showValidationMessage('Both fields are required!');
          return false;
        }
        return { name, description };
      }
    });

    if (UserTypeData) {
      const { name, description } = UserTypeData;
      const requestData = {
        userId: parseInt(userId),
        RoleID:Role.RoleID,
        RoleName: name ,
        RoleDescription:description
     
      };
      console.log(requestData);
     

      try {
        setLoading(true);
        // Make the API call to update the department
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/Role/update`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setLoading(false);


          Swal.fire('Success!', result.message, 'success');
        } else {
          Swal.fire('Error', result.message || 'Failed to update UserType.', 'error');
          setLoading(false);
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        setLoading(false);
      }
    }

  };



  //   *************************************************************************
  //Role delete handle
  const handleRoleDelete = async (RoleId) => {
    console.log("Delete state with ID:", RoleId);
    console.log("Delete user id:", userId);
    // Implement API call to delete state
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/role/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId: parseInt(userId),
          RoleId: parseInt(RoleId)
        })
      });
      const result = await response.json();
      console.log(result)
    } catch (error) {
      console.error('Error deleting state:', error);
      Swal.fire('Error', 'An error occurred while deleting the state', 'error');
    }
  };



  // **************************************************************************************

  // for Role create api
  const handleRoleCreate = async () => {
    setLoading(true);
    // const token = localStorage.getItem("token");
    // const userId = localStorage.getItem("userId");
    console.log(userId);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/Role/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserId: (userId),
          RoleName: Role,
          RoleDescription: RoleDesc,
          UserTypeID: selectedUserType

          // "userId": 2,
          // "RoleName": "New Role",
          // "RoleDescription": "New Role Description",
          // "UserTypeID": "1"
        })

      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Success', data.message, 'success');
        // Maybe close the modal
        setModalVisible(null);
      } else {
        // Handle login failure
        Swal.fire('Error', data?.message || 'Failed to create state', 'error');
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire('Error', error || 'An error occurred during login.', 'error');
    } finally {
      // setaddRole('');
      setLoading(false);
    }
  };



  // ***************************************************************
  // handle Role CRUD Operation end









  const handleStateCreate = async () => {
    setLoading(true);
    // const token = localStorage.getItem("token");
    // const userId = localStorage.getItem("userId");
    console.log(token, userId, addState);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/state/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({
          "userId": userId,
          "stateName": addState
        })
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Success', data.message, 'success');
        // Maybe close the modal
        setModalVisible(null);
      } else {
        // Handle login failure
        Swal.fire('Error', data?.message || 'Failed to create state', 'error');
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire('Error', error || 'An error occurred during login.', 'error');
    } finally {
      setaddState('');
      setLoading(false);
    }
  };


  // for city create api
  const handleCityCreate = async () => {
    setLoading(true);
    // const token = localStorage.getItem("token");
    // const userId = localStorage.getItem("userId");
    console.log(userId, addCity, selectedState);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/city/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserId: (userId),
          CityName: addCity,
          StateId: (selectedState)
        })

      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Success', data.message, 'success');
        // Maybe close the modal
        setModalVisible(null);
      } else {
        // Handle login failure
        Swal.fire('Error', data?.message || 'Failed to create state', 'error');
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire('Error', error || 'An error occurred during login.', 'error');
    } finally {
      setaddCity('');
      setLoading(false);
    }
  };





  const openModal = (index) => {
    setModalVisible(index); // Open modal for specific setting card
  };

  const closeModal = () => {
    setSelectedState('')
    setCities([]);

    setModalVisible(null); // Close the modal
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Basic Settings</h2>
      <p className="mt-2 text-gray-600">Manage your settings here</p>

      {/* Cards with icons */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {settingsData.map((setting, index) => (
          <div key={index} onClick={() => openModal(index)} className="bg-white p-6 shadow cursor-pointer rounded-lg flex items-center space-x-4">
            <setting.icon size={32} color="#4A90E2" />
            <div>
              <h3 className="text-lg font-semibold">{setting.title}</h3>
              <p className="text-sm text-gray-600">{setting.description}</p>
            </div>

          </div>
        ))}
      </div>

      {/* Conditionally render modal for each setting */}
      {modalVisible !== null && settingsData[modalVisible].title === 'Change Password' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">Change Your Password</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your old password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your new password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Confirm your new password"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                  } text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
              >
                {loading ? 'Updating...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* city Section */}
      {modalVisible !== null && settingsData[modalVisible].title === 'Cities' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] sm:w-[90vw] md:w-[70vw] lg:w-[80vw] max-w-4xl">

            <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">

              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-semibold">{settingsData[modalVisible].title}</h2>

                {/* State Dropdown */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600">State Name</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(Number(e.target.value))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a State</option>
                    {states.map((state) => (
                      <option key={state.StateId} value={state.StateId}>
                        {state.StateName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Name Input */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600">City Name</label>
                  <input
                    type="text"
                    value={addCity}
                    onChange={(e) => setaddCity(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter City Name"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCityCreate}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                      } text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
                  >
                    {loading ? 'Updating...' : 'Add city'}
                  </button>
                </div>
              </div>

              {/* Right Side: Table of Cities */}
              <div className="w-full lg:w-1/2 p-4 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">List of Cities</h2>
                <CityTable
                  cities={cities}
                  handleCityEdit={handleCityEdit}
                  handlecityDelete={handlecityDelete}
                />
              </div>

            </div>
          </div>
        </div>
      )}


      {/*  state  Section */}
      {modalVisible !== null && settingsData[modalVisible].title == 'States' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] sm:w-[90vw] md:w-[70vw] lg:w-[80vw] max-w-4xl">

            <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">

              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-semibold">{settingsData[modalVisible].title}</h2>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600">State Name</label>
                  <input
                    type="text"
                    value={addState}
                    onChange={(e) => setaddState(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter State Name"
                  />
                </div>


                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStateCreate}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                      } text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
                  >
                    {loading ? 'Updating...' : 'Add state'}
                  </button>

                </div>
              </div>

              {/* Right Side: Table of States */}
              <div className="w-full lg:w-1/2 p-4 overflow-auto" >
                <h2 className="text-xl font-semibold mb-4">List of States</h2>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center text-xl font-semibold text-gray-500">Please wait, States are loading...</div>
                  ) : (
                    <StateTable
                      states={states}
                      handlestateEdit={handlestateEdit}
                      handlestateDelete={handlestateDelete}
                    />
                  )}
                </div>
              </div>


            </div>

          </div>
        </div>
      )}






      {/* //Department Section */}

      {modalVisible !== null && settingsData[modalVisible].title == 'Departments' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] sm:w-[90vw] md:w-[70vw] lg:w-[80vw] max-w-4xl">

            <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">

              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-semibold">{settingsData[modalVisible].title}</h2>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600">Department Name</label>
                  <input
                    type="text"
                    value={Department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Department Name"
                  />

                  <label className="block text-sm font-medium text-gray-600">Department Description</label>
                  <input
                    type="text"
                    value={DepartmentDesc}
                    onChange={(e) => setDepartmentDesc(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter Department Description"
                  />
                </div>


                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDepartmentCreate}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                      } text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
                  >
                    {loading ? 'Updating...' : 'Add Department'}
                  </button>

                </div>
              </div>

              {/* Right Side: Table of States */}
              <div className="w-full lg:w-[70%] p-4 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">List of Departments</h2>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center text-xl font-semibold text-gray-500">
                      Please wait, Departments are loading...
                    </div>
                  ) : (
                    <DepartmentTable
                      Departmentlist={Departmentlist} // Passing the departments list
                      handleDepartmentEdit={handleDepartmentEdit} // Replace with your edit function
                      handleDepartmentDelete={handleDepartmentDelete} // Replace with your delete function
                    />
                  )}
                </div>
              </div>


            </div>
          </div>
        </div>
      )}






      {/* //desingnation Section */}

      {modalVisible !== null && settingsData[modalVisible].title == 'Designation' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] sm:w-[90vw] md:w-[70vw] lg:w-[80vw] max-w-4xl">

            <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">

              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-semibold">{settingsData[modalVisible].title}</h2>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600">Designation Name</label>
                  <input
                    type="text"
                    value={desingnation}
                    onChange={(e) => setdesingnation(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter desingnation Name"
                  />

                  <label className="block text-sm font-medium text-gray-600">Designation Description</label>
                  <input
                    type="text"
                    value={desingnationDesc}
                    onChange={(e) => setdesingnationDesc(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter desingnation Description"
                  />
                </div>


                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handledesingnationCreate}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                      } text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
                  >
                    {loading ? 'Updating...' : 'Add Designation'}
                  </button>

                </div>
              </div>

              {/* Right Side: Table of States */}
              <div className="w-full lg:w-[70%] p-4 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">List of designation</h2>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center text-xl font-semibold text-gray-500">
                      Please wait, designation are loading...
                    </div>
                  ) : (
                    <DesingnationTable
                      designationList={desingnationlist} // Passing the departments list
                      handledesingnationEdit={handledesingnationEdit} // Replace with your edit function
                      handleDesignationDelete={handledesingnationDelete} // Replace with your delete function
                    />
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* //Role Section */}
      {modalVisible !== null && settingsData[modalVisible].title === 'Role' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] sm:w-[90vw] md:w-[70vw] lg:w-[80vw] max-w-4xl">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">
              {/* Left: Role Form */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-semibold">Role Management</h2>
                <div className="mt-4 space-y-4">
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedUserType}
                    onChange={(e) => setselectedUserType(e.target.value)}
                  >
                    <option value="">Select User Type</option>
                    {UserTypelist.map((type) => (
                      <option key={type.UserTypeID} value={type.UserTypeID}>
                        {type.UserTypeName}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={Role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter Role Name"
                  />
                  <input
                    type="text"
                    value={RoleDesc}
                    onChange={(e) => setRoleDesc(e.target.value )}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter Role Description"
                  />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                  <button
                    onClick={handleRoleCreate}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'} text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
                  >
                    {loading ? 'Saving...' : 'Add Role'}
                  </button>
                </div>
              </div>

              {/* Right: Role List */}
              <div className="w-full lg:w-[70%] p-4 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">List of UserType</h2>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center text-xl font-semibold text-gray-500">
                      Please wait, Role are loading...
                    </div>
                  ) : (
                    <RoleTable
                      Rolelist={Rolelist} // Passing the departments list
                      handleRoleEdit={handleRoleEdit} // Replace with your edit function
                      handleRoleDelete={handleRoleDelete} // Replace with your delete function
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}






      {/* //User Type Section */}

      {modalVisible !== null && settingsData[modalVisible].title == 'User Type' && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] sm:w-[90vw] md:w-[70vw] lg:w-[80vw] max-w-4xl">

            <div className="flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0">

              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-xl font-semibold">{settingsData[modalVisible].title}</h2>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-600">User Type</label>
                  <input
                    type="text"
                    value={UserType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter User Type"
                  />

                  <label className="block text-sm font-medium text-gray-600">User Type Description</label>
                  <input
                    type="text"
                    value={UserTypeDesc}
                    onChange={(e) => setUserTypeDesc(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter User Type Description"
                  />
                </div>


                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUserTypeCreate}
                    disabled={loading}
                    className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                      } text-white py-2 px-4 rounded-lg hover:bg-blue-600`}
                  >
                    {loading ? 'Updating...' : 'Add User Type'}
                  </button>

                </div>
              </div>

              {/* Right Side: Table of Usertype */}
              <div className="w-full lg:w-[70%] p-4 overflow-auto">
                <h2 className="text-xl font-semibold mb-4">List of UserType</h2>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center text-xl font-semibold text-gray-500">
                      Please wait, UserType are loading...
                    </div>
                  ) : (
                    <UserTypeTable
                      UserTypelist={UserTypelist} // Passing the departments list
                      handleUserTypeEdit={handleUserTypeEdit} // Replace with your edit function
                      handleUserTypeDelete={handleUserTypeDelete} // Replace with your delete function
                    />
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default BasicSettings;



