
// =====================================================
// RELLOCATESEVA - LOGIN JAVASCRIPT
// File: login.js
// =====================================================


// =====================================================
// HTML ELEMENTS
// =====================================================

// Mobile
const mobile = document.getElementById("mobile");
const mobileError = document.getElementById("mobileError");

// Mobile OTP
const mobileOtpBtn = document.getElementById("mobileOtpBtn");
const mobileOtpSection = document.getElementById("mobileOtpSection");
const mobileOtp = document.getElementById("mobileOtp");
const verifyMobileBtn = document.getElementById("verifyMobileBtn");
const mobileOtpMessage = document.getElementById("mobileOtpMessage");

// Gmail
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");

// Gmail OTP
const emailOtpBtn = document.getElementById("emailOtpBtn");
const emailOtpSection = document.getElementById("emailOtpSection");
const emailOtp = document.getElementById("emailOtp");
const verifyEmailBtn = document.getElementById("verifyEmailBtn");
const emailOtpMessage = document.getElementById("emailOtpMessage");

// Location
const state = document.getElementById("state");
const city = document.getElementById("city");
const district = document.getElementById("district");
const village = document.getElementById("village");
const mohalla = document.getElementById("mohalla");
const locationError = document.getElementById("locationError");

// Login
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");


// =====================================================
// VERIFICATION STATUS
// =====================================================

let mobileVerified = false;
let emailVerified = false;


// =====================================================
// MOBILE NUMBER - ONLY NUMBERS
// =====================================================

mobile.addEventListener("input", function () {

    // Sirf numbers allow honge
    this.value = this.value.replace(/\D/g, "");

    // Maximum 10 digits
    this.value = this.value.slice(0, 10);

    // Number change hone par verification reset
    mobileVerified = false;

    mobileError.textContent = "";
    mobileOtpMessage.textContent = "";

});


// =====================================================
// MOBILE VALIDATION
// =====================================================

function validateMobile() {

    const number = mobile.value.trim();

    if (number.length !== 10) {

        mobileError.textContent =
            "Please enter a valid 10 digit mobile number.";

        return false;
    }

    // Indian mobile number 6,7,8,9 se start hona chahiye
    if (!/^[6-9][0-9]{9}$/.test(number)) {

        mobileError.textContent =
            "Mobile number must start with 6, 7, 8 or 9.";

        return false;
    }

    mobileError.textContent = "";

    return true;
}


// =====================================================
// SEND MOBILE OTP
// =====================================================

mobileOtpBtn.addEventListener("click", function () {

    if (!validateMobile()) {
        return;
    }

    // OTP box show
    mobileOtpSection.style.display = "block";

    mobileOtpMessage.textContent =
        "Mobile OTP section ready.";

    mobileOtpMessage.style.color = "#2563eb";

    mobileOtp.focus();

    /*
       IMPORTANT:

       Abhi actual SMS nahi jayega.
       Backend connect hone ke baad
       yahin se real SMS OTP API call hogi.
    */
});


// =====================================================
// MOBILE OTP - ONLY 6 DIGITS
// =====================================================

mobileOtp.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

    this.value = this.value.slice(0, 6);

});


// =====================================================
// VERIFY MOBILE OTP
// =====================================================

verifyMobileBtn.addEventListener("click", function () {

    if (mobileOtp.value.length !== 6) {

        mobileOtpMessage.textContent =
            "Please enter the 6 digit OTP.";

        mobileOtpMessage.style.color = "#dc2626";

        return;
    }

    /*
       TEMPORARY FRONTEND TEST

       Real OTP verification backend se hoga.
    */

    mobileVerified = true;

    mobileOtpMessage.textContent =
        "✓ Mobile OTP verified successfully.";

    mobileOtpMessage.style.color = "#16a34a";

    checkLoginReady();

});


// =====================================================
// GMAIL INPUT
// =====================================================

email.addEventListener("input", function () {

    emailError.textContent = "";

    emailOtpMessage.textContent = "";

    emailVerified = false;

});


// =====================================================
// GMAIL VALIDATION
// =====================================================

function validateEmail() {

    const gmail = email.value.trim();

    if (gmail === "") {

        emailError.textContent =
            "Please enter your Gmail address.";

        return false;
    }

    // Sirf Gmail allow
    const gmailPattern =
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailPattern.test(gmail)) {

        emailError.textContent =
            "Please enter a valid Gmail address.";

        return false;
    }

    emailError.textContent = "";

    return true;
}

// ============================================
// SEND GMAIL OTP
// ============================================

emailOtpBtn.addEventListener("click", async function () {

    if (!validateEmail()) {
        return;
    }

    emailOtpBtn.disabled = true;

    emailOtpMessage.textContent = "Gmail par OTP bheja ja raha hai...";
    emailOtpMessage.style.color = "#2563eb";

    try {
        const response = await fetch(
            "http://localhost:5000/api/send-email-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value.trim().toLowerCase()
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "OTP send nahi hua.");
        }

        emailOtpSection.style.display = "block";

        emailOtpMessage.textContent =
            "OTP Gmail par bhej diya gaya hai. Inbox aur Spam check karein.";

        emailOtpMessage.style.color = "#16a34a";

        emailOtp.focus();

    } catch (error) {
        emailOtpMessage.textContent =
            error.message || "Backend se connection nahi ho raha.";

        emailOtpMessage.style.color = "#dc2626";

        console.error("Send Gmail OTP error:", error);

    } finally {
        emailOtpBtn.disabled = false;
    }
});


// ============================================
// GMAIL OTP - ONLY 6 DIGITS
// ============================================

emailOtp.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 6);
});


// ============================================
// VERIFY GMAIL OTP
// ============================================

verifyEmailBtn.addEventListener("click", async function () {

    if (!validateEmail()) {
        return;
    }

    if (!/^\d{6}$/.test(emailOtp.value.trim())) {
        emailOtpMessage.textContent = "6-digit OTP enter karein.";
        emailOtpMessage.style.color = "#dc2626";
        return;
    }

    verifyEmailBtn.disabled = true;

    emailOtpMessage.textContent = "OTP verify ho raha hai...";
    emailOtpMessage.style.color = "#2563eb";

    try {
        const response = await fetch(
            "http://localhost:5000/api/verify-email-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.value.trim().toLowerCase(),
                    otp: emailOtp.value.trim()
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "OTP verification failed.");
        }

        emailVerified = true;

        emailOtpMessage.textContent =
            "Gmail OTP verified successfully!";

        emailOtpMessage.style.color = "#16a34a";

        checkLoginReady();

    } catch (error) {
        emailVerified = false;

        emailOtpMessage.textContent =
            error.message || "OTP verify nahi hua.";

        emailOtpMessage.style.color = "#dc2626";

        console.error("Verify Gmail OTP error:", error);

    } finally {
        verifyEmailBtn.disabled = false;
    }
});

// =====================================================
// LOCATION DATA
// State → City → District → Village → Mohalla
// =====================================================

const locationData = {

    jharkhand: {

        cities: {

            jamshedpur: {

                name: "Jamshedpur",

                districts: {

                    eastSinghbhum: {

                        name: "East Singhbhum",

                        villages: [
                            "Sonari",
                            "Mango",
                            "Sakchi",
                            "Bistupur",
                            "Kadma",
                            "Telco"
                        ],

                        mohallas: [
                            "Sakchi Market",
                            "Bistupur",
                            "Mango Chowk",
                            "Sonari",
                            "Kadma",
                            "Telco"
                        ]
                    }
                }
            },


            ranchi: {

                name: "Ranchi",

                districts: {

                    ranchi: {

                        name: "Ranchi",

                        villages: [
                            "Harmu",
                            "Kanke",
                            "Morabadi",
                            "Namkum",
                            "Doranda"
                        ],

                        mohallas: [
                            "Harmu",
                            "Morabadi",
                            "Lalpur",
                            "Doranda",
                            "Kanke"
                        ]
                    }
                }
            }
        }
    },


    bihar: {

        cities: {

            patna: {

                name: "Patna",

                districts: {

                    patna: {

                        name: "Patna",

                        villages: [
                            "Danapur",
                            "Maner",
                            "Bihta"
                        ],

                        mohallas: [
                            "Kankarbagh",
                            "Rajendra Nagar",
                            "Boring Road",
                            "Patliputra"
                        ]
                    }
                }
            }
        }
    },


    "west-bengal": {

        cities: {

            kolkata: {

                name: "Kolkata",

                districts: {

                    kolkata: {

                        name: "Kolkata",

                        villages: [
                            "Jadavpur",
                            "Behala",
                            "Dum Dum"
                        ],

                        mohallas: [
                            "Salt Lake",
                            "Park Street",
                            "New Town",
                            "Behala"
                        ]
                    }
                }
            }
        }
    },


    odisha: {

        cities: {

            bhubaneswar: {

                name: "Bhubaneswar",

                districts: {

                    khordha: {

                        name: "Khordha",

                        villages: [
                            "Patia",
                            "Khandagiri",
                            "Baramunda"
                        ],

                        mohallas: [
                            "Patia",
                            "Khandagiri",
                            "Sahid Nagar",
                            "Jayadev Vihar"
                        ]
                    }
                }
            }
        }
    },


    delhi: {

        cities: {

            delhi: {

                name: "Delhi",

                districts: {

                    centralDelhi: {

                        name: "Central Delhi",

                        villages: [
                            "Karol Bagh",
                            "Paharganj",
                            "Rajinder Nagar"
                        ],

                        mohallas: [
                            "Connaught Place",
                            "Karol Bagh",
                            "Paharganj",
                            "Rajinder Nagar"
                        ]
                    }
                }
            }
        }
    },


    maharashtra: {

        cities: {

            mumbai: {

                name: "Mumbai",

                districts: {

                    mumbai: {

                        name: "Mumbai",

                        villages: [
                            "Andheri",
                            "Bandra",
                            "Borivali"
                        ],

                        mohallas: [
                            "Andheri West",
                            "Bandra West",
                            "Borivali",
                            "Dadar"
                        ]
                    }
                }
            }
        }
    }
};


// =====================================================
// STATE CHANGE
// =====================================================

state.addEventListener("change", function () {

    resetSelect(city, "Select City");
    resetSelect(district, "Select District");
    resetSelect(village, "Select Village");
    resetSelect(mohalla, "Select Mohalla / Area");

    const selectedState = locationData[this.value];

    if (!selectedState) {
        checkLoginReady();
        return;
    }

    Object.keys(selectedState.cities).forEach(function (cityKey) {

        const option = document.createElement("option");

        option.value = cityKey;

        option.textContent =
            selectedState.cities[cityKey].name;

        city.appendChild(option);
    });

    city.disabled = false;

    checkLoginReady();
});


// =====================================================
// CITY CHANGE
// =====================================================

city.addEventListener("change", function () {

    resetSelect(district, "Select District");
    resetSelect(village, "Select Village");
    resetSelect(mohalla, "Select Mohalla / Area");

    const selectedState =
        locationData[state.value];

    if (!selectedState) {
        return;
    }

    const selectedCity =
        selectedState.cities[this.value];

    if (!selectedCity) {
        return;
    }

    Object.keys(selectedCity.districts).forEach(function (districtKey) {

        const option = document.createElement("option");

        option.value = districtKey;

        option.textContent =
            selectedCity.districts[districtKey].name;

        district.appendChild(option);
    });

    district.disabled = false;

    checkLoginReady();
});


// =====================================================
// DISTRICT CHANGE
// =====================================================

district.addEventListener("change", function () {

    resetSelect(village, "Select Village");
    resetSelect(mohalla, "Select Mohalla / Area");

    const selectedState =
        locationData[state.value];

    if (!selectedState) {
        return;
    }

    const selectedCity =
        selectedState.cities[city.value];

    if (!selectedCity) {
        return;
    }

    const selectedDistrict =
        selectedCity.districts[this.value];

    if (!selectedDistrict) {
        return;
    }


    // Village list
    selectedDistrict.villages.forEach(function (villageName) {

        const option = document.createElement("option");

        option.value = villageName;

        option.textContent = villageName;

        village.appendChild(option);
    });


    // Mohalla list
    selectedDistrict.mohallas.forEach(function (mohallaName) {

        const option = document.createElement("option");

        option.value = mohallaName;

        option.textContent = mohallaName;

        mohalla.appendChild(option);
    });


    village.disabled = false;
    mohalla.disabled = false;

    checkLoginReady();
});


// =====================================================
// VILLAGE CHANGE
// =====================================================

village.addEventListener("change", function () {

    checkLoginReady();

});


// =====================================================
// MOHALLA CHANGE
// =====================================================

mohalla.addEventListener("change", function () {

    checkLoginReady();

});


// =====================================================
// RESET SELECT
// =====================================================

function resetSelect(element, text) {

    element.innerHTML =
        `<option value="">${text}</option>`;

    element.disabled = true;

}


// =====================================================
// CHECK LOCATION
// =====================================================

function isLocationComplete() {

    return (
        state.value !== "" &&
        city.value !== "" &&
        district.value !== "" &&
        village.value !== "" &&
        mohalla.value !== ""
    );

}


// =====================================================
// CHECK LOGIN BUTTON
// =====================================================

function checkLoginReady() {

    const locationComplete =
        isLocationComplete();

    if (
        mobileVerified &&
        emailVerified &&
        locationComplete
    ) {

        loginBtn.disabled = false;

    } else {

        loginBtn.disabled = true;

    }

}


// =====================================================
// LOGIN BUTTON
// =====================================================

loginBtn.addEventListener("click", function () {

    if (loginBtn.disabled) {
        return;
    }

    message.textContent =
        "Login successful! Welcome to RelocateSeva.";

    message.style.color = "#16a34a";


    // User data
    const userData = {

        mobile: mobile.value,

        email: email.value,

        location: {

            state: state.value,

            city: city.value,

            district: district.value,

            village: village.value,

            mohalla: mohalla.value

        }

    };


    console.log("RelocateSeva User Data:");

    console.log(userData);

});
