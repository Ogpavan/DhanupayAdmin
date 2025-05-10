// *****************************************************************
// handle Role CRUD Operation Staret 


//handle Role edit
  const handleRoleEdit = async (Role) => {
    // const userId = localStorage.getItem('userId');
    // const token = localStorage.getItem('token');

    if (!userId || !token) {
      Swal.fire('Error', 'User is not authenticated. Please log in.', 'error');
      return;
    }
    const { value: newRoleName } = await Swal.fire({
      title: 'Enter New Role Name',
      input: 'text',
      inputValue: Role.RoleName,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Role name cannot be empty!';
        }
      }
    });

    if (newRoleName) {
      const requestData = {
        userId: parseInt(userId),
        RoleId: Role.RoleId,
        RoleName: newRoleName
      };
      console.log(requestData);

      try {
        // Make the API call to update the Role
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

          Swal.fire('Success!', result.message, 'success');

        } else {

          Swal.fire('Error', result.message || 'Failed to update Role.', 'error');
        }
      } catch (error) {

        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/Role/delete`, {
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
      console.log(userId, addRole, selectedState);
  
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/Role/create`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            UserId: (userId),
            RoleName: addRole,
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
        setaddRole('');
        setLoading(false);
      }
    };
  


    // ***************************************************************
    // handle Role CRUD Operation end
  
