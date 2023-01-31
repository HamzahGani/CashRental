// #region Setup
var body = document.body;
var head = document.head;
//var head = document.getElementsByTagName("head")[0];
//var body = document.getElementsByTagName("body")[0];
var colorLightBlue = "#206bc4";
var colorDarkBlue = "#1d60b0";
var colorLightBase = "#fff";
var colorDarkBase = "#000";
document.addEventListener("DOMContentLoaded", function () {
    buildHtml();
    calculator();
    showHideModal(true); // TODO - remove after testing
});
// #endregion
function calculator() {
    var ratePerAnnum = 0.08; // fixed
    var ratePerMonth = 0.02; // fixed
    var nPer = 1; // fixed
    var nPerAnnuity = 12; // fixed
    var typeBegin = 1; // fixed
    var typeEnd = 0; // fixed
    var fV = 0; // fixed
    var pvAssetAcquired = 0; // input
    var rate = 0; // input - Annual interest rate = Discount rate
    var rentalPeriodYears = 0; // input
    var monthlyRentalPayment = 0; // calc
    var n = rentalPeriodYears * nPerAnnuity; // calc
    var submitBtn = document.getElementById("submitBtn");
    if (submitBtn == null) {
        return;
    }
    submitBtn.onclick = function () {
        if (!checkInputValues()) {
            return;
        }
        calcInputValues();
        buildFooterSavingsTable();
    };
    function checkInputValues() {
        var inputElements = document.getElementsByClassName("calcInput");
        for (var i = 0; i < inputElements.length; i++) {
            if (inputElements[i].value == null || inputElements[i].value == "") {
                inputElements[i].classList.add("inputRed");
                inputElements[i].classList.remove("inputGreen");
            }
            else {
                inputElements[i].classList.add("inputGreen");
                inputElements[i].classList.remove("inputRed");
            }
        }
        var redInputElements = document.getElementsByClassName("inputRed");
        for (var i = 0; i < redInputElements.length; i++) {
            var el = redInputElements[i].style;
            el.borderColor = "red";
        }
        var greenInputElements = document.getElementsByClassName("inputGreen");
        for (var i = 0; i < greenInputElements.length; i++) {
            var el = greenInputElements[i].style;
            el.borderColor = "green";
        }
        return redInputElements.length == 0 ? true : false;
    }
    function calcInputValues() {
        rentalPeriodYears = document.getElementById("InputRentalPeriodYears").value;
        pvAssetAcquired = document.getElementById("InputPvAssetAcquired").value;
        rate = document.getElementById("InputRate").value;
        var monthlyRentalPeriod;
        try {
            monthlyRentalPeriod = rentalPeriodYears * 12;
        }
        catch (error) {
            console.log(error);
            monthlyRentalPeriod = 1;
        }
        console.log("InputPvAssetAcquired: " + pvAssetAcquired);
        console.log("InputRate: " + rate);
        console.log("InputRentalPeriodMonths: " + monthlyRentalPeriod);
    }
    function buildFooterSavingsTable() {
        var costsArr = [];
        var losses = [];
        var benefit = pvAssetAcquired * 0.20 * 0.27;
        for (var i = 0; i < rentalPeriodYears; i++) {
            costsArr.push(Math.round(pvAssetAcquired * (1 + (i / 10)) * -1));
        }
        var savingsTable = document.getElementById("modalFooter_savingsTable");
        savingsTable.innerHTML = "";
        var savingsTableRowHead = document.createElement("tr");
        var savingsTableHeadColsList = ["Year", "Tax benfit", "Opportunity cost", "Cash flow"];
        for (var i = 0; i < savingsTableHeadColsList.length; i++) {
            var savingsTableHead = document.createElement("th");
            savingsTableHead.innerHTML = savingsTableHeadColsList[i];
            savingsTableRowHead.appendChild(savingsTableHead);
            var el = savingsTableHead.style;
            el.borderStyle = "solid";
            el.borderWidth = "2px";
            el.borderCollapse = "collapse";
            el.width = "140px";
        }
        ;
        savingsTable.appendChild(savingsTableRowHead);
        var newRow = document.createElement("tr");
        var colYear = document.createElement("td");
        var colTaxBenefit = document.createElement("td");
        var colOpportunityCost = document.createElement("td");
        var colCashflow = document.createElement("td");
        colYear.innerHTML = "0";
        colTaxBenefit.innerHTML = "";
        colOpportunityCost.innerHTML = "";
        colCashflow.innerHTML = (-pvAssetAcquired).toString();
        for (var i = 0; i < rentalPeriodYears; i++) {
            var opportunityCost = costsArr[i];
            losses.push(benefit + opportunityCost);
            var newRow = document.createElement("tr");
            var colYear = document.createElement("td");
            var colTaxBenefit = document.createElement("td");
            var colOpportunityCost = document.createElement("td");
            var colCashflow = document.createElement("td");
            colYear.innerHTML = (i + 1).toString();
            colTaxBenefit.innerHTML = benefit.toString(); //(100).toString();
            colOpportunityCost.innerHTML = opportunityCost; //(-200).toString();
            colCashflow.innerHTML = losses[i];
            newRow.appendChild(colYear);
            newRow.appendChild(colTaxBenefit);
            newRow.appendChild(colOpportunityCost);
            newRow.appendChild(colCashflow);
            savingsTable.appendChild(newRow);
        }
    }
}
function buildHtml() {
    setup();
    function setup() {
        btnOpen();
        modalBackground();
        modalContent();
        modalContentTop();
        modalContentMid();
        modalContentBot();
        onclickElements();
    }
    function btnOpen() {
        var openBtn = document.createElement("button"); //Create the button
        openBtn.id = "openBtn";
        openBtn.innerHTML = "+ -";
        body.appendChild(openBtn);
        style();
        function style() {
            var el = openBtn.style;
            el.backgroundColor = colorLightBlue;
            el.border = "none";
            el.borderRadius = "100%";
            el.cursor = "pointer";
            el.color = "white";
            el.fontSize = "110%";
            el.fontWeight = "bold";
            el.position = "absolute";
            el.right = '40px';
            el.bottom = '40px';
            el.scale = "160%";
            el.width = "40px";
            el.height = "40px";
        }
    }
    function modalBackground() {
        var modalBackground = document.createElement("div");
        modalBackground.id = "modalBackground";
        body.appendChild(modalBackground);
        style();
        function style() {
            var el = modalBackground.style;
            el.display = "none";
            el.position = "fixed";
            el.zIndex = "1";
            el.paddingTop = "100px";
            el.left = "0";
            el.top = "0";
            el.width = "100%";
            el.height = "100%";
            el.overflow = "auto";
            el.backgroundColor = "rgb(0,0,0)";
            el.backgroundColor = "rgba(0,0,0,0.6)";
        }
    }
    function modalContent() {
        var modalContent = document.createElement("div");
        modalContent.id = "modalContent";
        var modalBackground = document.getElementById("modalBackground");
        modalBackground.appendChild(modalContent);
        modalContentStyle();
        setKeyFrames();
        function modalContentStyle() {
            var el = modalContent.style;
            el.position = "relative";
            el.backgroundColor = "#fefefe";
            el.margin = "auto";
            el.padding = "0";
            el.borderStyle = "none";
            el.borderWidth = "1px";
            el.borderColor = colorDarkBase;
            el.width = "50%";
            el.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)";
            el.animationName = "animatetop";
            el.animationDuration = "0.4s";
        }
        function setKeyFrames() {
            var cssAnimation = document.createElement('style');
            cssAnimation.setAttribute("type", "text/css");
            var rules = document.createTextNode('@-webkit-keyframes animatetop {'
                + 'from { top:-300px; opacity: 0}'
                + 'to { top:0; opacity: 1 }'
                + '}'
                + "@keyframes animatetop {"
                + "from {top:-300px; opacity:0}"
                + "to {top:0; opacity:1}"
                + "}");
            cssAnimation.appendChild(rules);
            head.appendChild(cssAnimation);
        }
    }
    function modalContentTop() {
        var modalHeader = document.createElement("div");
        var headerText = document.createElement("h2");
        var closeBtn = document.createElement("button");
        enable();
        modalHeaderStyle();
        closeBtnStyle();
        function enable() {
            modalHeader.id = "modalHeader";
            headerText.id = "modalHeader_headerText";
            closeBtn.id = "modalHeader_closeBtn";
            headerText.innerHTML = "Cash Vs Rental Calculator";
            closeBtn.innerHTML = "&times;";
            modalHeader.appendChild(closeBtn);
            modalHeader.appendChild(headerText);
            var modalContent = document.getElementById("modalContent");
            modalContent.appendChild(modalHeader);
        }
        function modalHeaderStyle() {
            var el = modalHeader.style;
            el.padding = "2px 16px";
            el.backgroundColor = colorLightBlue;
            el.color = "white";
        }
        function closeBtnStyle() {
            var el = closeBtn.style;
            el.color = "white";
            el.float = "right";
            el.fontSize = "28px";
            el.fontWeight = "bold";
            el.backgroundColor = colorLightBase;
            el.border = "none";
            el.borderRadius = "100%";
            el.cursor = "pointer";
            el.color = colorLightBlue;
            el.marginTop = "15px";
        }
    }
    function modalContentMid() {
        var modalBody = document.createElement("div");
        var bodyHead = document.createElement("h3");
        var bodyText = document.createElement("h4");
        var InputPvAssetAcquired = document.createElement("input");
        var InputRate = document.createElement("input");
        var InputRentalPeriodYears = document.createElement("input");
        var submitBtn = document.createElement("button");
        enable();
        modalBodyStyle();
        inputStyle();
        submitBtnStyle();
        function enable() {
            modalBody.id = "modalBody";
            bodyHead.id = "modalBody_bodyHead";
            bodyText.id = "modalBody_bodyText";
            bodyHead.innerHTML = "To calculate your cost savings";
            modalBody.appendChild(bodyHead);
            bodyText.innerHTML = 'Please fill in the below information and click "Calculate Savings"';
            modalBody.appendChild(bodyText);
            var modalContent = document.getElementById("modalContent");
            modalContent.appendChild(modalBody);
            InputPvAssetAcquired.id = "InputPvAssetAcquired";
            InputPvAssetAcquired.placeholder = "Purchase Value";
            InputPvAssetAcquired.title = "Purchase value of asset acquired";
            InputPvAssetAcquired.className = "calcInput";
            InputRate.id = "InputRate";
            InputRate.placeholder = "Rate of return";
            InputRate.title = "WACC ( Weighted ave cost of Capital, normal investors expected rate of return for the entity)";
            InputRate.className = "calcInput";
            InputRentalPeriodYears.id = "InputRentalPeriodYears";
            InputRentalPeriodYears.placeholder = "rental period in years";
            InputRentalPeriodYears.title = "Number of years of rental payments";
            InputRentalPeriodYears.className = "calcInput";
            submitBtn.id = "submitBtn";
            submitBtn.innerHTML = "Calculate Savings";
            var divElements = document.createElement("div");
            divElements.appendChild(InputPvAssetAcquired);
            divElements.appendChild(document.createElement("br"));
            divElements.appendChild(InputRate);
            divElements.appendChild(document.createElement("br"));
            divElements.appendChild(InputRentalPeriodYears);
            divElements.appendChild(document.createElement("br"));
            divElements.appendChild(submitBtn);
            //var modalBody = document.getElementById("modalBody");
            modalBody.appendChild(divElements);
        }
        function modalBodyStyle() {
            var el = modalBody.style;
            el.padding = "2px 16px";
        }
        function inputStyle() {
            var inputElements = document.getElementsByClassName("calcInput");
            for (var i = 0; i < inputElements.length; i++) {
                var el = inputElements[i].style;
                el.fontSize = "16px";
                el.marginBottom = "10px";
                el.borderColor = colorLightBlue;
            }
        }
        function submitBtnStyle() {
            var el = submitBtn.style;
            el.width = "180px";
            el.height = "30px";
            el.border = "none";
            el.backgroundColor = colorLightBlue;
            el.cursor = "pointer";
            el.color = "white";
            el.fontSize = "100%";
            el.fontWeight = "bold";
        }
    }
    function modalContentBot() {
        var modalFooter = document.createElement("div");
        var footerText = document.createElement("h3");
        var savingsTable = document.createElement("table");
        enable();
        tableStyle();
        modalFooterTextStyle();
        modalFooterStyle();
        function tableStyle() {
            var el = savingsTable.style;
            el.borderStyle = "solid";
            el.borderWidth = "2px";
            el.borderCollapse = "collapse";
        }
        function enable() {
            savingsTable.id = "modalFooter_savingsTable";
            modalFooter.id = "modalFooter";
            footerText.id = "modalFooter_footerText";
            footerText.innerHTML = "Savings";
            modalFooter.appendChild(footerText);
            modalFooter.appendChild(savingsTable);
            var modalContent = document.getElementById("modalContent");
            modalContent.appendChild(modalFooter);
        }
        function modalFooterTextStyle() {
            var el = footerText.style;
            el.color = colorLightBlue;
        }
        function modalFooterStyle() {
            var el = modalFooter.style;
            el.padding = "2px 16px";
            el.marginTop = "15px";
            el.paddingBottom = "20px";
            el.backgroundColor = colorLightBase;
            el.borderTopStyle = "solid";
            el.borderTopWidth = "2px";
            el.borderTopColor = colorLightBlue;
        }
    }
    function onclickElements() {
        openButton();
        closeButton();
        clickOutsideModal();
        submitButton();
        function submitButton() {
            var submitBtn = document.getElementById("submitBtn");
            var el = submitBtn.style;
            submitBtn.addEventListener('mouseenter', function (e) {
                el.color = colorLightBlue;
                el.textDecoration = 'none';
                el.backgroundColor = "white";
                el.borderStyle = "solid";
            });
            submitBtn.addEventListener('mouseleave', function (e) {
                el.color = 'white';
                el.borderStyle = "none";
                el.backgroundColor = colorLightBlue;
            });
        }
        function openButton() {
            var openBtn = document.getElementById("openBtn");
            if (openBtn == null) {
                return;
            }
            openBtn.onclick = function () {
                showHideModal(true);
            };
            var el = openBtn.style;
            openBtn.addEventListener('mouseenter', function (e) {
                el.color = colorLightBlue;
                el.textDecoration = 'none';
                el.backgroundColor = "white";
                el.borderStyle = "solid";
            });
            openBtn.addEventListener('mouseleave', function (e) {
                el.color = 'white';
                el.borderStyle = "none";
                el.backgroundColor = colorLightBlue;
            });
        }
        function closeButton() {
            var closeBtn = document.getElementById("modalHeader_closeBtn");
            if (closeBtn == null) {
                return;
            }
            closeBtn.onclick = function () {
                showHideModal(false);
            };
            var el = closeBtn.style;
            closeBtn.addEventListener('mouseenter', function (e) {
                el.backgroundColor = colorLightBlue;
                el.color = colorLightBase;
                el.borderStyle = "solid";
                el.borderColor = colorLightBase;
                el.textDecoration = 'none';
            });
            closeBtn.addEventListener('mouseleave', function (e) {
                el.color = colorLightBlue;
                el.backgroundColor = colorLightBase;
                el.borderStyle = "none";
            });
        }
        function clickOutsideModal() {
            window.onclick = function (event) {
                var modalBackground = document.getElementById("modalBackground");
                if (event.target == modalBackground) {
                    //showHideModal(false);
                }
            };
        }
    }
}
function showHideModal(show) {
    var el = document.getElementById("modalBackground").style;
    if (show) {
        el.display = "block";
    }
    else {
        el.display = "none";
        resetInputs();
    }
}
function resetInputs() {
    var InputPvAssetAcquired = document.getElementById("InputPvAssetAcquired");
    var InputRate = document.getElementById("InputRate");
    var InputRentalPeriodYears = document.getElementById("InputRentalPeriodYears");
    InputPvAssetAcquired.value = "";
    InputRate.value = "";
    InputRentalPeriodYears.value = "";
    var inputElements = document.getElementsByClassName("calcInput");
    for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].classList.remove("inputRed");
        inputElements[i].classList.remove("inputGreen");
        inputElements[i].value = "";
        inputElements[i].style.borderColor = colorLightBlue;
    }
}
//# sourceMappingURL=site.js.map