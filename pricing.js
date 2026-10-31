/* =====================================================
   RELOCATESEVA - SMART PRICING CALCULATOR
   ===================================================== */

"use strict";


// =====================================================
// 1. ROUTE DISTANCE DATA
// =====================================================

// Illustrative local-route estimates in kilometres.
// Verify these distances before using them for real quotes.

const routeDistances = {
    "Gopalganj": {
        "Thawe": 6,
        "Mirganj": 18,
        "Kuchaikote": 16,
        "Barauli": 20,
        "Hathua": 15,
        "Bhore": 35
    },

    "Thawe": {
        "Gopalganj": 6,
        "Mirganj": 20,
        "Kuchaikote": 12,
        "Barauli": 25,
        "Hathua": 18,
        "Bhore": 38
    },

    "Mirganj": {
        "Gopalganj": 18,
        "Thawe": 20,
        "Kuchaikote": 30,
        "Barauli": 32,
        "Hathua": 20,
        "Bhore": 25
    },

    "Kuchaikote": {
        "Gopalganj": 16,
        "Thawe": 12,
        "Mirganj": 30,
        "Barauli": 35,
        "Hathua": 25,
        "Bhore": 45
    },

    "Barauli": {
        "Gopalganj": 20,
        "Thawe": 25,
        "Mirganj": 32,
        "Kuchaikote": 35,
        "Hathua": 28,
        "Bhore": 42
    },

    "Hathua": {
        "Gopalganj": 15,
        "Thawe": 18,
        "Mirganj": 20,
        "Kuchaikote": 25,
        "Barauli": 28,
        "Bhore": 20
    },

    "Bhore": {
        "Gopalganj": 35,
        "Thawe": 38,
        "Mirganj": 25,
        "Kuchaikote": 45,
        "Barauli": 42,
        "Hathua": 20
    }
};


// =====================================================
// 2. PRICING CONFIGURATION
// =====================================================

// These are configurable demo rates, not verified market prices.

const PRICING = {

    baseCharge: 800,

    distanceRate: 20,

    minimumPrice: 1500,

    areaMultiplier: {
        normal: 1,
        population: 1.15
    },

    items: {
        "Bed": 250,
        "Sofa": 300,
        "Almirah": 250,
        "Table": 100,
        "Chair": 50,
        "TV": 150,
        "Fridge": 250,
        "Washing Machine": 250,
        "Boxes": 30,
        "Other Items": 100
    },

    services: {
        packing: 800,
        unpacking: 500,
        dismantling: 400,
        assembly: 400
    },

    floorRate: 100,

    manualCarryingCharge: 300
};


// =====================================================
// 3. HELPER FUNCTIONS
// =====================================================

function getElement(id) {
    return document.getElementById(id);
}


function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

}


function showError(message) {

    const error = getElement("errorMessage");

    if (!error) return;

    error.textContent = message;

    error.style.display = "block";

    error.style.color = "#c62828";

    error.style.background = "#fff0f0";

    error.style.padding = "12px";

    error.style.marginTop = "15px";

    error.style.borderRadius = "8px";

    error.setAttribute("role", "alert");

}


function clearError() {

    const error = getElement("errorMessage");

    if (error) {

        error.textContent = "";

        error.style.display = "none";

    }

}


// =====================================================
// 4. CALCULATE ROUTE DISTANCE
// =====================================================

function getRouteDistance(pickup, drop) {

    if (pickup === drop) {

        return 0;

    }

    if (
        routeDistances[pickup] &&
        routeDistances[pickup][drop] !== undefined
    ) {

        return routeDistances[pickup][drop];

    }

    return null;

}


// =====================================================
// 5. AUTOMATIC DISTANCE UPDATE
// =====================================================

function updateDistance() {

    const pickupElement = getElement("pickup");

    const dropElement = getElement("drop");

    const distanceElement = getElement("distance");

    const messageElement = getElement("distanceMessage");

    if (
        !pickupElement ||
        !dropElement ||
        !distanceElement
    ) {

        return;

    }

    const pickup = pickupElement.value;

    const drop = dropElement.value;

    if (!pickup || !drop) {

        distanceElement.value = "";

        if (messageElement) {

            messageElement.textContent =
                "Please select pickup and drop locations.";

        }

        return;

    }

    if (pickup === drop) {

        distanceElement.value = "0";

        if (messageElement) {

            messageElement.textContent =
                "Pickup and drop locations must be different.";

        }

        return;

    }

    const distance = getRouteDistance(pickup, drop);

    if (distance === null) {

        distanceElement.value = "";

        if (messageElement) {

            messageElement.textContent =
                "Distance is unavailable for this route.";

        }

        return;

    }

    distanceElement.value = distance;

    if (messageElement) {

        messageElement.textContent =
            "Estimated route distance: " +
            distance +
            " km. Actual road distance may vary.";

    }

}


// =====================================================
// 6. READ HOUSEHOLD ITEMS
// =====================================================

function calculateItemCost() {

    const itemInputs = document.querySelectorAll(".item-qty");

    let total = 0;

    const selectedItems = [];

    for (const input of itemInputs) {

        const quantity = Number(input.value);

        const name = input.dataset.name;

        if (
            !Number.isFinite(quantity) ||
            quantity < 0 ||
            !Number.isInteger(quantity)
        ) {

            throw new Error(
                "Please enter a valid whole-number quantity for " +
                (name || "household items") +
                "."
            );

        }

        if (quantity === 0) {

            continue;

        }

        if (!Object.prototype.hasOwnProperty.call(
            PRICING.items,
            name
        )) {

            throw new Error(
                "Pricing is not configured for " + name + "."
            );

        }

        const unitPrice = PRICING.items[name];

        const itemTotal = quantity * unitPrice;

        total += itemTotal;

        selectedItems.push({

            name: name,

            quantity: quantity,

            unitPrice: unitPrice,

            total: itemTotal

        });

    }

    return {

        total: total,

        items: selectedItems

    };

}


// =====================================================
// 7. CALCULATE FLOOR CHARGES
// =====================================================

function calculateFloorCost() {

    const pickupFloor = Number(
        getElement("pickupFloor")?.value || 0
    );

    const dropFloor = Number(
        getElement("dropFloor")?.value || 0
    );

    const liftCharge = getElement("lift")?.value;

    if (
        !Number.isFinite(pickupFloor) ||
        !Number.isFinite(dropFloor)
    ) {

        throw new Error(
            "Please select valid floor details."
        );

    }

    const floorTotal = pickupFloor + dropFloor;

    const manualCharge = Number(liftCharge || 0);

    return {

        pickupFloor: pickupFloor,

        dropFloor: dropFloor,

        floorTotal: floorTotal,

        manualCharge: manualCharge,

        total: floorTotal + manualCharge

    };

}


// =====================================================
// 8. CALCULATE ADDITIONAL SERVICES
// =====================================================

function calculateServiceCost() {

    let total = 0;

    const selectedServices = [];

    for (const [serviceId, price] of Object.entries(
        PRICING.services
    )) {

        const checkbox = getElement(serviceId);

        if (checkbox && checkbox.checked) {

            total += price;

            selectedServices.push({

                name: serviceId,

                price: price

            });

        }

    }

    return {

        total: total,

        services: selectedServices

    };

}


// =====================================================
// 9. VALIDATE FORM
// =====================================================

function validateForm() {

    const pickup = getElement("pickup")?.value;

    const drop = getElement("drop")?.value;

    const areaType = getElement("areaType")?.value;

    if (!pickup || !drop) {

        throw new Error(
            "Please select both pickup and drop locations."
        );

    }

    if (pickup === drop) {

        throw new Error(
            "Pickup and drop locations must be different."
        );

    }

    if (!areaType || !PRICING.areaMultiplier[areaType]) {

        throw new Error(
            "Please select your area type."
        );

    }

    const distance = getRouteDistance(pickup, drop);

    if (distance === null || distance <= 0) {

        throw new Error(
            "A valid route distance could not be calculated."
        );

    }

    const items = calculateItemCost();

    if (items.items.length === 0) {

        throw new Error(
            "Please enter the quantity of at least one household item."
        );

    }

    return {

        pickup: pickup,

        drop: drop,

        areaType: areaType,

        distance: distance,

        items: items

    };

}


// =====================================================
// 10. DISPLAY PRICE BREAKDOWN
// =====================================================

function displayPriceBreakdown(data) {

    const result = getElement("result");

    if (!result) return;

    let breakdown = getElement("priceBreakdown");

    if (!breakdown) {

        breakdown = document.createElement("div");

        breakdown.id = "priceBreakdown";

        breakdown.className = "price-breakdown";

        const heading = result.querySelector(".result-heading");

        if (heading) {

            heading.insertAdjacentElement(
                "afterend",
                breakdown
            );

        } else {

            result.prepend(breakdown);

        }

    }

    const rows = [

        ["Base moving charge", data.baseCharge],

        [
            "Travel charge (" + data.distance + " km)",
            data.travelCharge
        ],

        ["Household items", data.itemCost],

        ["Floor handling", data.floorCost],

        ["Additional services", data.serviceCost],

        ["Area adjustment", data.areaAdjustment]

    ];

    breakdown.replaceChildren();

    const title = document.createElement("h3");

    title.textContent = "Your Price Breakdown";

    breakdown.appendChild(title);

    const list = document.createElement("div");

    list.className = "price-breakdown-list";

    for (const [label, amount] of rows) {

        const row = document.createElement("div");

        row.className = "price-row";

        const name = document.createElement("span");

        name.textContent = label;

        const value = document.createElement("strong");

        value.textContent = formatCurrency(amount);

        row.append(name, value);

        list.appendChild(row);

    }

    breakdown.appendChild(list);

    const totalRow = document.createElement("div");

    totalRow.className = "price-total";

    const totalLabel = document.createElement("span");

    totalLabel.textContent = "Estimated Total";

    const totalValue = document.createElement("strong");

    totalValue.textContent = formatCurrency(data.finalPrice);

    totalRow.append(totalLabel, totalValue);

    breakdown.appendChild(totalRow);

    const note = document.createElement("p");

    note.className = "price-note";

    note.textContent =
        "This is an estimate based on the selected details. " +
        "The final quotation may vary after verification.";

    breakdown.appendChild(note);

    result.style.display = "block";

}


// =====================================================
// 11. MAIN PRICE CALCULATOR
// =====================================================

function calculatePrice() {

    clearError();

    const result = getElement("result");

    if (result) {

        result.style.display = "none";

    }

    try {

        const form = validateForm();

        const floor = calculateFloorCost();

        const services = calculateServiceCost();

        // Travel charge
        const travelCharge =
            form.distance * PRICING.distanceRate;

        // Fixed moving charge
        const baseCharge = PRICING.baseCharge;

        // Total before area adjustment
        const subtotal =
            baseCharge +
            travelCharge +
            form.items.total +
            floor.total +
            services.total;

        // Population-area adjustment applies to moving subtotal.
        // It is not added as a separate percentage to every service.
        const multiplier =
            PRICING.areaMultiplier[form.areaType];

        const areaAdjustedTotal = Math.round(
            subtotal * multiplier
        );

        const areaAdjustment =
            areaAdjustedTotal - subtotal;

        // Enforce minimum quotation
        const finalPrice = Math.max(
            PRICING.minimumPrice,
            areaAdjustedTotal
        );

        // Update route summary
        const showPickup = getElement("showPickup");

        const showDrop = getElement("showDrop");

        if (showPickup) {

            showPickup.textContent = form.pickup;

        }

        if (showDrop) {

            showDrop.textContent = form.drop;

        }

        // Ensure distance is updated
        const distanceInput = getElement("distance");

        if (distanceInput) {

            distanceInput.value = form.distance;

        }

        displayPriceBreakdown({

            baseCharge: baseCharge,

            distance: form.distance,

            travelCharge: travelCharge,

            itemCost: form.items.total,

            floorCost: floor.total,

            serviceCost: services.total,

            areaAdjustment: areaAdjustment,

            finalPrice: finalPrice

        });

        clearError();

        // Bring the calculated result into view
        if (result) {

            result.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    } catch (error) {

        showError(
            error.message ||
            "Something went wrong. Please check your details."
        );

    }

}


// =====================================================
// 12. INITIALIZE CALCULATOR
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const pickup = getElement("pickup");

    const drop = getElement("drop");

    if (pickup) {

        pickup.addEventListener("change", updateDistance);

    }

    if (drop) {

        drop.addEventListener("change", updateDistance);

    }

    // Keep the existing HTML onclick button functional.
    // Also support keyboard submission and future form changes.
    const calculateButton = document.querySelector(
        ".calculate-btn"
    );

    if (calculateButton) {

        calculateButton.addEventListener("click", function (event) {

            event.preventDefault();

            calculatePrice();

        });

    }

});