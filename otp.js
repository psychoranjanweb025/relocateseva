```javascript
const verifyButton =
    document.getElementById("verifyOtp");

const message =
    document.getElementById("message");


verifyButton.addEventListener(
    "click",
    async function () {

        const otp =
            document.getElementById("otp")
            .value
            .trim();


        const phone =
            sessionStorage.getItem(
                "loginPhone"
            );

        const email =
            sessionStorage.getItem(
                "loginEmail"
            );


        if (!phone || !email) {

            window.location.href =
                "login.html";

            return;
        }


        if (!/^[0-9]{6}$/.test(otp)) {

            message.innerText =
                "Please enter a valid 6 digit OTP.";

            return;
        }


        verifyButton.disabled = true;

        verifyButton.innerText =
            "Verifying...";


        try {

            const response =
                await fetch(
                    "/api/auth/verify-otp",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            phone: phone,

                            email: email,

                            otp: otp

                        })
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                window.location.href =
                    "location.html";

            }
            else {

                message.innerText =
                    data.message;

            }

        }
        catch (error) {

            console.log(error);

            message.innerText =
                "Server error.";

        }


        verifyButton.disabled = false;

        verifyButton.innerText =
            "Verify OTP";

    }
);
```
