// #region Setup program constants
const ratePerAnnum = 0.0775; // fixed
const ratePerMonth = 0.02; // fixed
const nPer = 1; // fixed
const nPerAnnuity = 12; // fixed
const typeBegin = 1; // fixed
const typeEnd = 0; // fixed
const fV = 0; // fixed
const benfitPercent = 0.20 * 0.27; // fixed
const savingsTableHeadColsList = ["Year", "Tax benfit", "Opportunity cost", "Cash flow"]; // fixed
const body = document.body;
const head = document.head;
const colorLightBlue = "#206bc4";
const colorDarkBlue = "#1d60b0";
const colorLightBase = "#fff";
const colorDarkBase = "#000";
// #endregion
document.addEventListener("DOMContentLoaded", () => {
    buildHtml();
    calculator();
    showHideModal(true); // TODO - remove after testing
    initInput(); // TODO - remove afterr testing
});
function calculator() {
    var pvAssetAcquired = 0; // input
    var rate = 0; // input - Annual interest rate = Discount rate
    var rentalPeriodYears = 0; // input
    var rentalPeriodMonths;
    var benefit = 0; // calc
    var monthlyRentalPayment = 0; // calc
    var n = rentalPeriodYears * nPerAnnuity; // calc
    var costsArr = [];
    var costsValuationArr = [];
    var losses = [];
    var costNperArr = [];
    var benefitNperArr = [];
    var submitBtn = document.getElementById("submitBtn");
    if (submitBtn != null) {
        submitBtn.onclick = function () {
            document.getElementById("modalFooter_savingsTable").innerHTML = ""; // clear table
            costsValuationArr = [];
            costsArr = [];
            losses = [];
            costNperArr = [];
            benefitNperArr = [];
            if (!checkInputValues()) {
                return;
            }
            calcInputValues();
            buildFooterSavingsTable();
            styleSavingsTable();
        };
    }
    function checkInputValues() {
        var inputElements = document.getElementsByClassName("calcInput");
        for (let i = 0; i < inputElements.length; i++) {
            var el = inputElements[i].value;
            var elClass = inputElements[i].classList;
            try {
                var passed = true;
                var val = parseFloat(el);
                if (Number.isNaN(val) || el == null || el == "" || el == "0") {
                    passed = false;
                } // value must be a number (float or int)
                if (document.getElementById("InputRentalPeriodYears") == inputElements[i]) {
                    var remainder = val % 1;
                    if (remainder > 0 || el > 5) {
                        passed = false;
                    }
                } // years must be int and 5 or less
                if (!passed) {
                    elClass.add("inputRed");
                    elClass.remove("inputGreen");
                } // add class inputRed
                else {
                    elClass.add("inputGreen");
                    elClass.remove("inputRed");
                } // add class inputGreen
            }
            catch (error) {
                elClass.add("inputRed");
                elClass.remove("inputGreen");
            }
        } // test inputs (add red / green borders)
        // apply styling to input (green / red border)
        try {
            var redInputElements = document.getElementsByClassName("inputRed");
            for (let i = 0; i < redInputElements.length; i++) {
                var el = redInputElements[i].style;
                el.borderColor = "red";
            }
            var greenInputElements = document.getElementsByClassName("inputGreen");
            for (let i = 0; i < greenInputElements.length; i++) {
                var el = greenInputElements[i].style;
                el.borderColor = "green";
            }
        }
        catch (error) {
            return false;
        }
        return redInputElements.length == 0 ? true : false; // Return success / fail
    } // input cannot be null, 0, or "". years must be int. rate and assetValue must be float
    function calcInputValues() {
        try {
            rentalPeriodYears = document.getElementById("InputRentalPeriodYears").value;
            pvAssetAcquired = document.getElementById("InputPvAssetAcquired").value;
            rate = document.getElementById("InputRate").value;
            benefit = Math.round(pvAssetAcquired * benfitPercent);
            rentalPeriodMonths = rentalPeriodYears * 12;
            costsValuationArr.push(pvAssetAcquired);
            console.log("pvAssetAcquired: " + pvAssetAcquired);
            for (var i = 0; i < rentalPeriodYears; i++) {
                var opportunityCost = Math.round(parseInt(costsValuationArr[i]) * ratePerAnnum);
                var totalWithGrowth = Math.round(parseInt(costsValuationArr[i]) + opportunityCost);
                costsArr.push(opportunityCost);
                costsValuationArr.push(totalWithGrowth);
                console.log("opportunityCost: " + opportunityCost);
                //console.log("totalWithGrowth: " + totalWithGrowth);
                var costCashflow = pvCalc(rate, i + 1, 0, opportunityCost); // rate, nper, payment, fv, type
                costNperArr.push(costCashflow);
                console.log("costCashFlow: " + costCashflow);
                losses.push(Math.round(benefit - opportunityCost));
            }
            //logInputs();
        }
        catch (error) {
            rentalPeriodMonths = 1;
        }
    }
    function styleSavingsTable() {
        var savingsTable = document.getElementById("modalFooter_savingsTable");
        //savingsTable.style.textAlign = "center";
        var savingsTableRowHead = document.getElementById("savingsTableRowHead");
        //savingsTableRowHead.style.textAlign = "center";
        var savingsTableHeaders = document.getElementsByClassName("savingsTableHead");
        for (var i = 0; i < savingsTableHeaders.length; i++) {
            var savingsTableHead = savingsTableHeaders[i];
            var el = savingsTableHead.style;
            el.borderStyle = "solid";
            el.borderWidth = "1px";
            el.borderCollapse = "collapse";
            el.width = "80px";
            el.textAlign = "center";
            el.paddingRight = "10px";
            el.paddingLeft = "10px";
        }
        ; // style savings table headings
        var savingTableBodyList = document.getElementsByClassName("savingsTableBody");
        for (var i = 0; i < savingTableBodyList.length; i++) {
            var savingsTableHead = savingTableBodyList[i];
            var el = savingsTableHead.style;
            el.borderStyle = "solid";
            el.borderWidth = "1px";
            el.borderCollapse = "collapse";
            //el.width = "80px";
            el.textAlign = "center";
            el.paddingRight = "10px";
            el.paddingLeft = "10px";
        }
    }
    function buildFooterSavingsTable() {
        var savingsTable = document.getElementById("modalFooter_savingsTable");
        var savingsTableRowHead = document.createElement("tr");
        savingsTableRowHead.id = "savingsTableRowHead";
        for (var i = 0; i < savingsTableHeadColsList.length; i++) {
            var savingsTableHead = document.createElement("th");
            savingsTableHead.classList.add("savingsTableHead");
            savingsTableHead.innerHTML = savingsTableHeadColsList[i];
            savingsTableRowHead.appendChild(savingsTableHead);
        }
        ; // build savings table headings
        savingsTable.appendChild(savingsTableRowHead);
        buildTableFirstRow();
        buildTableBody();
        function buildTableFirstRow() {
            var newRow = document.createElement("tr");
            var colYear = document.createElement("td");
            var colTaxBenefit = document.createElement("td");
            var colOpportunityCost = document.createElement("td");
            var colCashflow = document.createElement("td");
            colYear.innerHTML = "0";
            colYear.classList.add("savingsTableBody");
            colTaxBenefit.innerHTML = "";
            colTaxBenefit.classList.add("savingsTableBody");
            colOpportunityCost.innerHTML = "";
            colOpportunityCost.classList.add("savingsTableBody");
            colCashflow.innerHTML = (-pvAssetAcquired).toString();
            colCashflow.classList.add("savingsTableBody");
            newRow.appendChild(colYear);
            newRow.appendChild(colTaxBenefit);
            newRow.appendChild(colOpportunityCost);
            newRow.appendChild(colCashflow);
            savingsTable.appendChild(newRow);
        }
        function buildTableBody() {
            for (var i = 0; i < rentalPeriodYears; i++) {
                var newRow = document.createElement("tr");
                newRow.classList.add("savingsTableBodyRow");
                var colYear = document.createElement("td");
                colYear.innerHTML = Math.round((i + 1)).toString();
                colYear.classList.add("savingsTableBody");
                var colTaxBenefit = document.createElement("td");
                colTaxBenefit.innerHTML = benefit.toString();
                colTaxBenefit.classList.add("savingsTableBody");
                var colOpportunityCost = document.createElement("td");
                colOpportunityCost.innerHTML = costsArr[i];
                colOpportunityCost.classList.add("savingsTableBody");
                var colCashflow = document.createElement("td");
                colCashflow.innerHTML = losses[i];
                colCashflow.classList.add("savingsTableBody");
                newRow.appendChild(colYear);
                newRow.appendChild(colTaxBenefit);
                newRow.appendChild(colOpportunityCost);
                newRow.appendChild(colCashflow);
                savingsTable.appendChild(newRow);
            }
        }
    }
    function logInputs() {
        console.log("InputPvAssetAcquired: " + pvAssetAcquired);
        console.log("InputRate: " + rate);
        console.log("InputRentalPeriodMonths: " + rentalPeriodMonths);
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
            InputPvAssetAcquired.type = "number";
            InputRate.id = "InputRate";
            InputRate.placeholder = "Rate of return";
            InputRate.title = "WACC ( Weighted ave cost of Capital, normal investors expected rate of return for the entity)";
            InputRate.className = "calcInput";
            InputRate.type = "number";
            InputRentalPeriodYears.id = "InputRentalPeriodYears";
            InputRentalPeriodYears.placeholder = "rental period in years";
            InputRentalPeriodYears.title = "Number of years of rental payments";
            InputRentalPeriodYears.className = "calcInput";
            InputRentalPeriodYears.type = "number";
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
            for (let i = 0; i < inputElements.length; i++) {
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
            submitBtn.addEventListener('mouseenter', (e) => {
                el.color = colorLightBlue;
                el.textDecoration = 'none';
                el.backgroundColor = "white";
                el.borderStyle = "solid";
            });
            submitBtn.addEventListener('mouseleave', (e) => {
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
            openBtn.addEventListener('mouseenter', (e) => {
                el.color = colorLightBlue;
                el.textDecoration = 'none';
                el.backgroundColor = "white";
                el.borderStyle = "solid";
            });
            openBtn.addEventListener('mouseleave', (e) => {
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
            closeBtn.addEventListener('mouseenter', (e) => {
                el.backgroundColor = colorLightBlue;
                el.color = colorLightBase;
                el.borderStyle = "solid";
                el.borderColor = colorLightBase;
                el.textDecoration = 'none';
            });
            closeBtn.addEventListener('mouseleave', (e) => {
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
    var modalFooter_savingsTable = document.getElementById("modalFooter_savingsTable");
    InputPvAssetAcquired.value = "";
    InputRate.value = "";
    InputRentalPeriodYears.value = "";
    modalFooter_savingsTable.innerHTML = ""; // clear table
    var inputElements = document.getElementsByClassName("calcInput");
    for (let i = 0; i < inputElements.length; i++) {
        inputElements[i].classList.remove("inputRed");
        inputElements[i].classList.remove("inputGreen");
        inputElements[i].value = "";
        inputElements[i].style.borderColor = colorLightBlue;
    }
}
function initInput() {
    var pvInput = document.getElementById("InputPvAssetAcquired");
    pvInput.value = "1800000";
    var pvInput = document.getElementById("InputRate");
    pvInput.value = "21";
    var pvInput = document.getElementById("InputRentalPeriodYears");
    pvInput.value = "5";
}
// This function is from David Goodman's Javascript Bible.
function conv_number(expr, decplaces) {
    var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));
    while (str.length <= decplaces) {
        str = "0" + str;
    }
    var decpoint = str.length - decplaces;
    var returning = (str.substring(0, decpoint) + "." + str.substring(decpoint, str.length));
    console.log("conv_number: " + returning);
    return returning;
}
// Parameters are rate, total number of periods, payment made each period and future value
function pvCalc(rate, nper, pmt, fv) {
    var pv_value, x, y = 0;
    rate = parseFloat(rate);
    //rate = rate/100;
    nper = parseFloat(nper);
    pmt = parseFloat(pmt);
    fv = parseFloat(fv);
    console.log("pvCalc rate: " + rate);
    console.log("pvCalc nper: " + nper);
    console.log("pvCalc pmt: " + pmt);
    console.log("pvCalc fv: " + fv);
    if (nper == 0) {
        alert("Why do you want to test me with zeros?");
        return (0);
    }
    if (rate == 0) { // Interest rate is 0
        pv_value = -(fv + (pmt * nper));
        console.log("pv_value a: " + pv_value);
    }
    else {
        x = Math.pow(1 + rate, -nper);
        y = Math.pow(1 + rate, nper);
        pv_value = -(x * (fv * rate - pmt + y * pmt)) / rate;
        console.log("pv_value b: " + pv_value);
    }
    pv_value = conv_number(pv_value, 2);
    console.log("pv_value c: " + pv_value);
    return (pv_value);
}
//# sourceMappingURL=rentCalc.js.map