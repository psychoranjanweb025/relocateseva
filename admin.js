const pricingForm = document.getElementById("pricingForm");
const pricingMessage = document.getElementById("pricingMessage");

pricingForm.addEventListener("submit", function (event) {
event.preventDefault();

```
pricingMessage.textContent =
    "Backend abhi connect nahi hai. Pricing save nahi hui.";

pricingMessage.style.color = "#b45309";
```

});

document.querySelectorAll(".menu a").forEach(function (link) {
link.addEventListener("click", function () {
document.querySelectorAll(".menu a").forEach(function (item) {
item.classList.remove("active");
});

```
    this.classList.add("active");
});
```

});

document.getElementById("logoutBtn").addEventListener("click", function () {
alert("Admin authentication abhi setup nahi hui hai.");
});
