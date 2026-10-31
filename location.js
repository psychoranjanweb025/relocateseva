```javascript
const button =
    document.getElementById("locationButton");

const message =
    document.getElementById("message");


button.addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {

            message.innerText =
                "Location is not supported by your browser.";

            return;
        }


        button.disabled = true;

        button.innerText =
            "Getting Location...";


        navigator.geolocation.getCurrentPosition(

            async function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                try {

                    const response =
                        await fetch(
                            "/api/auth/save-location",
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                credentials: "include",

                                body: JSON.stringify({

                                    latitude: latitude,

                                    longitude: longitude

                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (data.success) {

                        sessionStorage.clear();

                        window.location.href =
                            "dashboard.html";

                    }
                    else {

                        message.innerText =
                            data.message;

                    }

                }
                catch (error) {

                    console.log(error);

                    message.innerText =
                        "Unable to save location.";

                }

            },


            function () {

                button.disabled = false;

                button.innerText =
                    "Allow Location";

                message.innerText =
                    "Please allow location permission.";

            }

        );

    }
);
```
