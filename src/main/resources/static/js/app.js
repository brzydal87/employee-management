document.addEventListener('DOMContentLoaded', function() {
    const employeeForm = document.getElementById('employeeForm');
    const employeeTable = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    const employeePopup = document.getElementById('employeePopup');
    const editEmployeePopup = document.getElementById('editEmployeePopup');
    const closeBtn = document.querySelector('.close');
    const closeEditBtn = document.querySelector('.close-edit');
    const employeeDetails = document.getElementById('employeeDetails');
    const editEmployeeForm = document.getElementById('editEmployeeForm');
    const logoutBtn = document.getElementById('logoutBtn');

    let userRole = null;

    // Fetch user role
    function fetchUserRole() {
            fetch('/api/user-role')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data); // Log the data to inspect its format
                    if (data && data.role) {
                        userRole = data.role; // Store the user role
                        adjustUIForRole(userRole); // Adjust UI based on fetched role
                        fetchEmployees(); // Fetch employees after fetching user role
                    } else {
                        console.error('Role data is not in the expected format:', data);
                    }
                })
                .catch(error => console.error('Error fetching user role:', error));
        }

        function adjustUIForRole(role) {
                if (role === 'REGULAR') {
                    // Example: Hide elements for regular users
                    document.getElementById('employeeForm').style.display = 'none';
                   // document.querySelector('.edit-btn').style.display = 'none';
                } else if (role === 'MANAGER') {
                    // Example: Show elements for managers
                    document.getElementById('employeeForm').style.display = 'block';
                }
            }


    // Fetch and display employees
    function fetchEmployees() {
            fetch('/api/employees')
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Log the data to inspect its format
                    if (Array.isArray(data)) {
                        employeeTable.innerHTML = '';
                        data.forEach(employee => {
                            const row = employeeTable.insertRow();
                            row.innerHTML = `
                                <td><a href="#" onclick="showEmployeeDetails('${employee.id}')">${employee.name}</a></td>
                                <td>${employee.surname}</td>
                                <td>${employee.position}</td>
                                <td>${employee.dayJoined}</td>
                                <td>${employee.salary}</td>
                                <td>${employee.dateOfBirth}</td>
                                    <td>
                                     <button class="edit-btn ${userRole === 'REGULAR' ? 'disabled-btn' : ''}" onclick="openEditPopup('${employee.id}')" ${userRole === 'REGULAR' ? 'disabled' : ''}>Edit</button>
                            <button class="delete-btn ${userRole === 'REGULAR' ? 'disabled-btn' : ''}" onclick="deleteEmployee('${employee.id}')" ${userRole === 'REGULAR' ? 'disabled' : ''}>Delete</button>
                                    </td>
                            `;
                        });
                    } else {
                        console.error('Expected an array but got:', data);
                    }
                })
                .catch(error => console.error('Error fetching employees:', error));
        }

    // Add employee
    employeeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const employee = {
            name: employeeForm.name.value,
            surname: employeeForm.surname.value,
            position: employeeForm.position.value,
            dayJoined: employeeForm.dayJoined.value,
            salary: employeeForm.salary.value,
            dateOfBirth: employeeForm.dateOfBirth.value
        };

        fetch('/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee)
        })
        .then(response => response.json())
        .then(() => {
            fetchEmployees();
            employeeForm.reset();
        });
    });

    // Edit employee
    window.openEditPopup = function(id) {
        fetch(`/api/employees/${id}`)
            .then(response => response.json())
            .then(employee => {
                document.getElementById('editEmployeeId').value = employee.id;
                document.getElementById('editEmployeeName').value = employee.name;
                document.getElementById('editEmployeeSurname').value = employee.surname;
                document.getElementById('editEmployeePosition').value = employee.position;
                document.getElementById('editEmployeeDayJoined').value = employee.dayJoined;
                document.getElementById('editEmployeeSalary').value = employee.salary;
                document.getElementById('editEmployeeDateOfBirth').value = employee.dateOfBirth;

                editEmployeePopup.style.display = 'block';
            });
    };

    // Save edited employee
    editEmployeeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const editedEmployee = {
            id: document.getElementById('editEmployeeId').value,
            name: editEmployeeForm.editEmployeeName.value,
            surname: editEmployeeForm.editEmployeeSurname.value,
            position: editEmployeeForm.editEmployeePosition.value,
            dayJoined: editEmployeeForm.editEmployeeDayJoined.value,
            salary: editEmployeeForm.editEmployeeSalary.value,
            dateOfBirth: editEmployeeForm.editEmployeeDateOfBirth.value
        };

        fetch(`/api/employees/${editedEmployee.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedEmployee)
        })
        .then(response => response.json())
        .then(() => {
            fetchEmployees();
            editEmployeePopup.style.display = 'none';
        });
    });

// Assuming logoutBtn is defined and points to your logout button element
logoutBtn.addEventListener('click', function(event) {
    event.preventDefault();

    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',  // Use application/json for JSON payloads
        },
        redirect: 'follow'  // Follow redirects
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login';  // Redirect to login page
        } else {
            console.log(response);
            console.error('Logout failed:', response.status);
        }
    })
    .catch(error => console.error('Error during logout:', error));
})
    // Delete employee
    window.deleteEmployee = function(id) {
        fetch(`/api/employees/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchEmployees());
    };

    // Show employee details in popup
    window.showEmployeeDetails = function(id) {
        fetch(`/api/employees/${id}`)
            .then(response => response.json())
            .then(employee => {
                employeeDetails.innerHTML = `
                    <p><strong>Name:</strong> ${employee.name}</p>
                    <p><strong>Surname:</strong> ${employee.surname}</p>
                    <p><strong>Position:</strong> ${employee.position}</p>
                    <p><strong>Day Joined:</strong> ${employee.dayJoined}</p>
                    <p><strong>Salary:</strong> ${employee.salary}</p>
                    <p><strong>Date of Birth:</strong> ${employee.dateOfBirth}</p>
                `;
                employeePopup.style.display = 'block';
            });
    };

    // Close the popup
    closeBtn.onclick = function() {
        employeePopup.style.display = 'none';
    };

    // Close the popup if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == employeePopup) {
            employeePopup.style.display = 'none';
        }
        if (event.target == editEmployeePopup) {
            editEmployeePopup.style.display = 'none';
        }
    };

    // Close the edit popup
    closeEditBtn.onclick = function() {
        editEmployeePopup.style.display = 'none';
    };

     fetchUserRole();
});
