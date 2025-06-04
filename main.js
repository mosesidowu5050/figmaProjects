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
