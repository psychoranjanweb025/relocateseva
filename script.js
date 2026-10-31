/* ================= LOGIN SYSTEM ================= */

let selectedMethod = "";
let generatedOTP = "";


/* OPEN LOGIN */

function openLogin() {

    document.getElementById("loginOverlay")
        .classList.add("active");

    backToOptions();
}


/* CLOSE LOGIN */

function closeLogin(event) {

    if (!event || event.target.id === "loginOverlay") {

        document.getElementById("loginOverlay")
            .classList.remove("active");
    }
}


/* SHOW MOBILE / EMAIL */

function showVerification(method) {

    selectedMethod = method;

    document.getElementById("loginOptions")
        .style.display = "none";

    document.getElementById("locationBox")
        .classList.remove("active");

    document.getElementById("verificationBox")
        .classList.add("active");


    const input = document.getElementById("contactInput");

    if (method === "mobile") {

        document.getElementById("verificationTitle")
            .innerText = "Mobile OTP Verification";

        document.getElementById("verificationText")
            .innerText =
            "Enter your mobile number to receive OTP.";

        input.type = "tel";
        input.placeholder = "Enter mobile number";

    }

    else if (method === "email") {

        document.getElementById("verificationTitle")
            .innerText = "Email OTP Verification";

        document.getElementById("verificationText")
            .innerText =
            "Enter your Gmail / Email to receive OTP.";

        input.type = "email";
        input.placeholder = "Enter Gmail / Email";
    }
}


/* SEND OTP */

function sendOTP() {

    const value =
        document.getElementById("contactInput").value.trim();

    const message =
        document.getElementById("loginMessage");


    if (!value) {

        message.innerText =
            "Please enter your mobile number or email.";

        return;
    }


    if (selectedMethod === "mobile") {

        if (!/^[0-9]{10}$/.test(value)) {

            message.innerText =
                "Please enter a valid 10 digit mobile number.";

            return;
        }
    }


    if (selectedMethod === "email") {

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {

            message.innerText =
                "Please enter a valid email address.";

            return;
        }
    }


    /*
       DEMO OTP

       IMPORTANT:
       This generates OTP only for frontend testing.
       Real OTP must be generated and sent from PHP/backend.
    */

    generatedOTP =
        Math.floor(100000 + Math.random() * 900000).toString();


    console.log("DEMO OTP:", generatedOTP);


    message.innerText =
        "Demo OTP generated. Check browser console.";

    document.getElementById("otpArea")
        .classList.add("active");
}


/* VERIFY OTP */

function verifyOTP() {

    const enteredOTP =
        document.getElementById("otpInput").value.trim();

    const message =
        document.getElementById("loginMessage");


    if (!enteredOTP) {

        message.innerText =
            "Please enter OTP.";

        return;
    }


    if (enteredOTP === generatedOTP) {

        message.innerText =
            "✓ Verification successful!";

        message.style.color = "green";


        setTimeout(() => {

            document.getElementById("loginOverlay")
                .classList.remove("active");

            document.getElementById("contact")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }, 1000);

    }

    else {

        message.innerText =
            "✗ Invalid OTP. Please try again.";

        message.style.color = "red";
    }
}


/* LOCATION VERIFICATION */

function verifyLocation() {

    document.getElementById("loginOptions")
        .style.display = "none";

    document.getElementById("verificationBox")
        .classList.remove("active");

    document.getElementById("locationBox")
        .classList.add("active");
}


/* GET LOCATION */

function getUserLocation() {

    const message =
        document.getElementById("locationMessage");


    if (!navigator.geolocation) {

        message.innerText =
            "Location is not supported by your browser.";

        return;
    }


    message.innerText =
        "Requesting your location...";


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);


            message.innerText =
                "✓ Location verified successfully!";

            message.style.color = "green";


            setTimeout(() => {

                document.getElementById("loginOverlay")
                    .classList.remove("active");

                document.getElementById("contact")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }, 1000);
        },


        function(error) {

            message.innerText =
                "Location permission is required to continue.";

            message.style.color = "red";
        }
    );
}


/* BACK */

function backToOptions() {

    document.getElementById("loginOptions")
        .style.display = "block";

    document.getElementById("verificationBox")
        .classList.remove("active");

    document.getElementById("locationBox")
        .classList.remove("active");

    document.getElementById("otpArea")
        .classList.remove("active");

    document.getElementById("contactInput")
        .value = "";

    document.getElementById("otpInput")
        .value = "";

    document.getElementById("loginMessage")
        .innerText = "";

    document.getElementById("locationMessage")
        .innerText = "";
}let relocationImages = [
    "relocate.jpg",
    "relocate2.jpg",
    "relocate3.jpg"
];

let imageNumber = 0;

setInterval(function () {

    imageNumber++;

    if (imageNumber >= relocationImages.length) {
        imageNumber = 0;
    }

    document.getElementById("relocateImage").src =
        relocationImages[imageNumber];

}, 2000);
