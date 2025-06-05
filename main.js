// Register resident
function registerResident() {
  const body = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phoneNumber: document.getElementById("phoneNumber").value.trim(),
    homeAddress: document.getElementById("homeAddress").value.trim(),
    password: document.getElementById("password").value.trim()
  };

  fetch("http://localhost:8080/api/resident/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(apiResponse => {
    const result = document.getElementById("registrationResult");
    result.innerHTML = apiResponse.success ?
      `<span style='color:green;'>✔ ${apiResponse.data.fullName} registered</span>` :
      `<span style='color:red;'>❌ ${apiResponse.data}</span>`;
  })
  .catch(error => {
    document.getElementById("registrationResult").innerHTML = `<span style='color:red;'>❌ ${error.message}</span>`;
  });
}

// Get list of visitors
function getVisitors() {
  fetch("http://localhost:8080/api/resident/listsOfVisitors")
    .then(response => response.json())
    .then(apiResponse => {
      if (apiResponse.success) {
        const visitors = apiResponse.data;
        const list = document.getElementById("visitorList");
        list.innerHTML = "";
        visitors.forEach(visitor => {
          const li = document.createElement("li");
          li.textContent = visitor.fullName;

          const phoneSpan = document.createElement("span");
          phoneSpan.className = "purpose";
          phoneSpan.textContent = visitor.phoneNumber || "No phone";

          li.appendChild(phoneSpan);
          list.appendChild(li);
        });
      } else {
        console.error("API call failed:", apiResponse);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

// Find access token
function findAccessToken() {
  const token = document.getElementById("visitorIdInput").value.trim();
  if (!token) {
    alert("Please enter the Access Token");
    return;
  }

  const requestBody = { token: token };

  fetch("http://localhost:8080/api/resident/find/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  })
  .then(response => response.json())
  .then(apiResponse => {
    const resultDiv = document.getElementById("accessTokenResult");
    if (apiResponse.success) {
      const tokenData = apiResponse.data;
      resultDiv.innerHTML = `
        <div class="token-section">
          <div><span class="label">Token:</span> ${tokenData.token}</div>
          <div><span class="label">Created On:</span> ${tokenData.createdOn}</div>
        </div>
        <br>
        <div><span class="label">Resident Name:</span> ${tokenData.resident.fullName}</div>
        <div><span class="label">Resident Phone:</span> ${tokenData.resident.phoneNumber}</div>
        <div><span class="label">Resident Address:</span> ${tokenData.resident.homeAddress}</div>
        <br>
        <div><span class="label">Visitor Name:</span> ${tokenData.visitor.fullName}</div>
        <div><span class="label">Visitor Phone:</span> ${tokenData.visitor.phoneNumber}</div>
        <div><span class="label">Visitor Address:</span> ${tokenData.visitor.homeAddress || "N/A"}</div>
      `;
    } else {
      resultDiv.innerHTML = `<span style="color:red;">❌ Error: ${apiResponse.data || "Token not found"}</span>`;
    }
  })
  .catch(error => {
    const resultDiv = document.getElementById("accessTokenResult");
    resultDiv.innerHTML = `<span style="color:red;">❌ Error: ${error.message}</span>`;
  });
}

// Generate access token
function generateAccessToken() {
  const requestBody = {
    residentName: document.getElementById("residentName").value.trim(),
    residentPhoneNumber: document.getElementById("residentPhoneNumber").value.trim(),
    visitorsName: document.getElementById("visitorsName").value.trim(),
    visitorsPhoneNumber: document.getElementById("visitorsPhoneNumber").value.trim(),
    visitorsAddress: document.getElementById("visitorsAddress").value.trim()
  };

  fetch("http://localhost:8080/api/resident/generate/code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return response.json();
  })
  .then(apiResponse => {
    const result = document.getElementById("tokenGenerateResult");
    if (apiResponse.success) {
      // Use otpCode instead of token
      result.innerHTML = `<span style='color:green;'>✔ Token Generated: ${apiResponse.data.otpCode}</span>`;
    } else {
      result.innerHTML = `<span style='color:red;'>❌ ${apiResponse.data}</span>`;
    }
  })
  .catch(error => {
    document.getElementById("tokenGenerateResult").innerHTML = `<span style='color:red;'>❌ ${error.message || JSON.stringify(error)}</span>`;
  });
}
