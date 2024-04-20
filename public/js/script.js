// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set current date
  document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });

  displayTopPerformingStudents();

  // Fetch lecturers and populate the table
  fetchLecturers();

  // Set up the charts
  setupAttendanceChart();
  

  // You can call this function with the specific lecturer's ID
  setupAuditLogChart(2); // Replace 2 with the actual lecturer ID

  // Call these functions when the modal is about to be shown
  $('#assignGradeModal').on('show.bs.modal', function () {
    console.log('Assign Grade modal shown.'); // Add this line for debugging
    populateStudents();
    populateModules();
  });

  fetchModulesAndPopulateSelects();

  // Fetch and display top-performing students and lecturers with modules
  fetchTopPerformingStudents();
  setupTopPerformingStudentsChart();

  // Call fetchModules when the modal is opened or the page is loaded
  $('#uploadMaterialsModal').on('show.bs.modal', function () {
    populateUploadMaterialsModules();
  });

  document.getElementById('uploadMaterialsForm').addEventListener('submit', handleUploadMaterialsFormSubmit);
  document.getElementById('createAssignmentForm').addEventListener('submit', createAssignment);


});

// Fetch lecturers and populate the table
function fetchLecturers() {
  fetch('/lecturers') // Adjust according to your API endpoint
    .then(response => response.json())
    .then(lecturers => {
        const tableBody = document.getElementById('lecturersTable');
        tableBody.innerHTML = ''; // Clear existing rows
        lecturers.forEach(lecturer => {
            // Check if module_names is not undefined and not an empty string
            const moduleNames = lecturer.module_names
                ? (Array.isArray(lecturer.module_names) 
                   ? lecturer.module_names.join(', ') // If array, join into string
                   : lecturer.module_names) // If string, use as is
                : 'No modules assigned'; // Default text if no modules
            
            const row = `<tr>
                           <td>${lecturer.name}</td>
                           <td>${lecturer.email}</td>
                           <td>${moduleNames}</td>
                         </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    })
    .catch(error => console.error('Error:', error));
}


// Set up the attendance chart
function setupAttendanceChart() {
  const ctx = document.getElementById('attendanceChart').getContext('2d');
  const attendanceChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          datasets: [{
              label: 'Attendance',
              data: [12, 19, 3, 17, 6],
              backgroundColor: 'rgba(0, 123, 255, 0.2)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1,
              tension: 0.4
          }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
      
  });
}

// Set up the audit log chart
function setupAuditLogChart(lecturerId) {
  fetch(`/audit-logs?lecturerId=${lecturerId}`)
    .then(response => response.json())
    .then(auditLogs => {
      const ctx = document.getElementById('auditLogChart').getContext('2d');
      const auditLogChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: auditLogs.map(log => new Date(log.timestamp).toLocaleDateString()),
          datasets: [{
            label: 'Actions',
            data: auditLogs.map(log => 1), // Every action counts as one
            actionNames: auditLogs.map(log => log.action), // Additional array for action names
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 159, 64, 0.8)',
            hoverBorderColor: 'rgba(255, 159, 64, 1)',
          }]
        },
        options: {
          tooltips: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              title: function(tooltipItems, data) {
                // Assuming `actionNames` is the array containing the names of the actions
                const itemIndex = tooltipItems[0].index;
                return data.datasets[tooltipItems[0].datasetIndex].actionNames[itemIndex];
              },
              label: function(tooltipItem, data) {
                // Return an empty string to not show the label text
                return '';
              }
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                parser: 'YYYY-MM-DD',
                tooltipFormat: 'll',
                unit: 'day'
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    })
    .catch(error => console.error('Error:', error));
}

// Function to show the success modal with a dynamic message
function showSuccessModal(message) {
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.textContent = message; // Set the dynamic message
  }
  $('#successModal').modal('show'); // Show the success modal
}


function submitGrade() {
  const studentId = document.getElementById('studentSelect').value;
  const moduleId = document.getElementById('moduleSelect').value;
  const score = document.getElementById('scoreInput').value;

  // Construct the grade assignment object
  const gradeAssignment = {
    student_id: studentId,
    module_id: moduleId,
    score: score
  };

  // Use fetch API to send the grade assignment to the server
  fetch('/assign-grade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gradeAssignment),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // Handle success - e.g., display a message, close the modal, refresh the data on the page
    $('#assignGradeModal').modal('hide');
    showSuccessModal('Grade Assigned successfully'); // Show success modal with dynamic message
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle errors - e.g., display an error message
  });
}
function populateStudents() {
  fetch('/students') // Adjust this if your API endpoint for fetching students is different
    .then(response => response.json())
    .then(students => {
      const studentSelect = document.getElementById('studentSelect');
      // Clear existing options first
      studentSelect.innerHTML = '';
      students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.student_id; 
        option.textContent = student.name; 
        studentSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error:', error));
}

function populateModules() {
  fetch('/modules') 
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      return response.json();
    })
    .then(modules => {
      const moduleSelect = document.getElementById('moduleSelect'); 
      moduleSelect.innerHTML = ''; // Clear existing options first
      modules.forEach(module => {
        const option = document.createElement('option');
        option.value = module.module_id; 
        option.textContent = module.module_name; 
        moduleSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error:', error));
}

function populateUploadMaterialsModules() {
  fetch('/modules') 
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      return response.json();
    })
    .then(modules => {
      const moduleSelect = document.getElementById('uploadMaterialsModuleSelect'); 
      moduleSelect.innerHTML = ''; // Clear existing options first
      modules.forEach(module => {
        const option = document.createElement('option');
        option.value = module.module_id; 
        option.textContent = module.module_name; 
        moduleSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch modules and populate select dropdowns
function fetchModulesAndPopulateSelects() {
  // Fetch modules from the server
  $.ajax({
    url: '/modules', 
    method: 'GET',
    success: function(modules) {
      // Populate the module select dropdowns
     // Clear existing options first
    $('#assignmentModule').empty();
    $('#lectureModule').empty();

    // Now append the new options
    modules.forEach(function(module) {
      // Append options to modals
      $('#assignmentModule').append(`<option value="${module.module_id}">${module.module_name}</option>`);
      $('#lectureModule').append(`<option value="${module.module_id}">${module.module_name}</option>`);
    });

    },
    error: function(err) {
      console.error('Error fetching modules:', err);
    }
  });
}

// Call the function to fetch modules and populate selects on page load
$(document).ready(function() {
  fetchModulesAndPopulateSelects();
});

// Function to handle form submission for uploading materials
function handleUploadMaterialsFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);

  // Fetch the module details based on the selected module_id
  const moduleId = form.uploadMaterialsModuleSelect.value;
  fetch(`/modules/${moduleId}`) // Fetch module details
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch module details');
      }
      return response.json();
    })
    .then(module => {
      // Append the module name to the FormData object
      formData.append('module_name', module.module_name);
      
      // Use the correct keys for the form data based on your backend expectations
      formData.append('module_id', moduleId);
      formData.append('title', form.materialTitle.value);
      formData.append('description', form.materialDescription.value);
      formData.append('file', form.materialFile.files[0]);
      
      // Make sure the endpoint matches your server configuration
      return fetch('/upload-materials', {
        method: 'POST',
        body: formData
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // Handle success - e.g., display a message, close the modal, refresh the page
      $('#uploadMaterialsModal').modal('hide');
      showSuccessModal('Materials uploaded successfully'); // Show success modal with dynamic message
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle errors here, e.g., by showing a user feedback message
    });
}

// Function to handle the submission of the create assignment form
function createAssignment(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = document.getElementById('createAssignmentForm');
  
  // Construct an object with the form data
  const assignmentData = {
    module_id: form.assignmentModule.value,
    title: form.assignmentTitle.value,
    description: form.assignmentDescription.value,
    due_date: form.assignmentDeadline.value,
  };

  console.log("Assignment data being sent:", assignmentData);

  // Use fetch to send a POST request to the server
  fetch('/create-assignment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(assignmentData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    // Here you can add code to update the UI with the new assignment
    $('#createAssignmentModal').modal('hide');
    showSuccessModal('Assignment created successfully');
    // Optionally refresh the assignments list if displayed on the same page
  })
  .catch((error) => {
    console.error('Error:', error);
    showSuccessModal('Error creating assignment'); // Assumes this function shows an error message
  });
}


function fetchTopPerformingStudents() {
  fetch('/top-performing-students')
    .then(response => response.json())
    .then(students => {
      const studentsList = document.getElementById('topPerformingStudents');
      studentsList.innerHTML = ''; // Clear any existing list items
      
      // Keep track of unique student-module combinations
      const uniqueCombinations = new Set();

      students.forEach(student => {
        // Check if the combination already exists in the set
        const combination = `${student.student_name}-${student.module_name}`;
        if (!uniqueCombinations.has(combination)) {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item';

          // Displaying student name, module, and score
          const moduleName = student.module_name || "Module Name Not Found";
          listItem.textContent = `${student.student_name} - ${moduleName}: Score: ${student.top_score}`;
          studentsList.appendChild(listItem);

          // Add the combination to the set
          uniqueCombinations.add(combination);
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function setupTopPerformingStudentsChart() {
  console.log('Initializing top performing students chart');
  const canvas = document.getElementById('topPerformingStudentsChart');
  if (!canvas) {
      console.error('Canvas element not found');
      return;
  }
  fetch('/top-performing-students') // API endpoint
      .then(response => response.json())
      .then(data => {
          // Create a map to hold the maximum score for each module
          const moduleMaxScores = new Map();

          // Iterate over the data to populate the map
          data.forEach(student => {
              // Check if the current score is higher than the stored max score for the module
              if (!moduleMaxScores.has(student.module_name) || student.top_score > moduleMaxScores.get(student.module_name).score) {
                  moduleMaxScores.set(student.module_name, { score: student.top_score, student_name: student.student_name });
              }
          });

          // Prepare the data for the chart
          const labels = Array.from(moduleMaxScores.keys());
          const dataPoints = Array.from(moduleMaxScores.values()).map(entry => entry.score);
          const backgroundColors = [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ]; // Add more colors as needed

          // Instantiate a new Chart
          const topPerformingStudentsChart = new Chart(canvas.getContext('2d'), {
              type: 'doughnut',
              data: {
                  labels: labels,
                  datasets: [{
                      label: 'Top Score per Module',
                      data: dataPoints,
                      backgroundColor: backgroundColors,
                      borderColor: backgroundColors.map(color => color.replace('0.2', '1')), // Increase opacity for borders
                      borderWidth: 1
                  }]
              },
              options: {
                  responsive: true,
                  plugins: {
                      legend: {
                          position: 'top',
                      },
                      tooltip: {
                          callbacks: {
                              // Optional: Add student names to tooltips
                              label: function(tooltipItem) {
                                  const student = moduleMaxScores.get(labels[tooltipItem.dataIndex]);
                                  return `${labels[tooltipItem.dataIndex]}: ${student.score} (by ${student.student_name})`;
                              }
                          }
                      },
                      title: {
                          display: true,
                          text: 'Top Performing Students per Module'
                      }
                  },
              }
          });
      })
      .catch(error => console.error('Error:', error));
}


// Function to display top-performing students
function displayTopPerformingStudents() {
  fetch('/top-performing-students')
    .then(response => response.json())
    .then(data => {
      // Group scores by student
      const studentsScores = data.reduce((acc, { student_id, student_name, module_name, top_score }) => {
        if (!acc[student_id]) {
          acc[student_id] = {
            student_name,
            scores: []
          };
        }
        acc[student_id].scores.push({ module_name, top_score });
        return acc;
      }, {});

      // Get the container for top-performing students
      const topPerformersDiv = document.getElementById('topPerformers');
      topPerformersDiv.innerHTML = ''; // Clear existing content

      // Create a card for each student
      Object.values(studentsScores).forEach(({ student_name, scores }) => {
        const card = document.createElement('div');
        card.className = 'card top-performer-card mb-3';
        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${student_name}</h5>
            <ul class="list-group list-group-flush">
              ${scores.map(score => 
                `<li class="list-group-item">${score.module_name}: ${score.top_score}</li>`
              ).join('')}
            </ul>
          </div>
        `;
        topPerformersDiv.appendChild(card);
      });
    })
    .catch(error => console.error('Error:', error));
}