```javascript
const sendOtpButton =
    document.getElementById("sendOtp");

const message =
    document.getElementById("message");


sendOtpButton.addEventListener(
    "click",
    async function () {

        const phone =
            document.getElementById("phone")
            .value
            .trim();

        const email =
            document.getElementById("email")
            .value
            .trim();


        // Check phone number

        if (!/^[0-9]{10}$/.test(phone)) {

            message.innerText =
                "Please enter a valid 10 digit phone number.";

            return;
        }


        // Check Gmail

        if (!email.endsWith("@gmail.com")) {

            message.innerText =
                "Please enter a valid Gmail address.";

            return;
        }


        sendOtpButton.disabled = true;

        sendOtpButton.innerText =
            "Sending OTP...";


        try {

            const response =
                await fetch(
                    "/api/auth/send-otp",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            phone: phone,

                            email: email

                        })
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                sessionStorage.setItem(
                    "loginPhone",
                    phone
                );

                sessionStorage.setItem(
                    "loginEmail",
                    email
                );


                window.location.href =
                    "otp.html";

            }
            else {

                message.innerText =
                    data.message;

            }

        }
        catch (error) {

            console.log(error);

            message.innerText =
                "Server connection failed.";

        }


        sendOtpButton.disabled = false;

        sendOtpButton.innerText =
            "Send OTP";

    }
);
```
