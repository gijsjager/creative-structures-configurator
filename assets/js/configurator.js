if (typeof coProductKey !== 'undefined') {
    var canvasContainer = document.getElementById("co-configurator-canvas");
    var twikitOrder = null;

    var context = window.twikit.createContext(
        coProductKey,
        canvasContainer,
        {
            loaded: function () {
                document.getElementById('co-configurator-wrapper').classList.add('co-initialized');
                if (document.getElementById('co-configurator-loading')) {
                    document.getElementById('co-configurator-loading')?.remove();
                }
                // Called when the context is loaded.
                // console.log("Twikbot context loaded!");
            },
            parametersReady: function (parameterContainer) {
                // add the parameters to the DOM
                document.getElementById("co-configurator-parameters").appendChild(parameterContainer)

                // create breadcrumbs
                createBreadcrumbs();

                // listen to the scroll of the parameters
                document.getElementById("co-configurator-ui").addEventListener("scroll", setBreadcrumb)

                // append submit button
                document.getElementById("co-configurator-submit").style.display = "block";

                // listen to the change of selected product
                document.getElementsByClassName('twikbot-dropdown')[0].addEventListener("change", function (e) {
                    var value = e.target.value;
                    // remove active class from all the products
                    var products = document.getElementsByClassName("co-configurator-product");
                    for (var i = 0; i < products.length; i++) {
                        products[i].classList.remove('active');
                        if (products[i].getAttribute('data-value') === value) {
                            products[i].classList.add('active');
                        }
                    }
                    setProductInfo(value);
                });
                // set the initial product info
                const initialProduct = document.querySelector('.twikbot-parameter-1319-type select').value;
                setProductInfo(initialProduct);

                // append the price for the product twikbot-parameter-1319-type type <select>
                const select = document.querySelectorAll('.twikbot-parameter-1319-type select option');
                Array.from(select).map(option => {
                    const value = option.value;
                    const productConfig = findProductConfigByValue(value);
                    option.innerHTML = option.innerHTML + ' - From ' + productConfig.priceFrom;
                });

                // bind scrolling to the canvas container
                bindCanvasStickyScroll();

                // set camera buttons
                setCameraButtons();
                setAreaButtons();

                // set the correct tooltips for the categories
                setCategoryTooltips();

                // Called when the context finished loading.
                if (typeof coInitialProduct !== 'undefined' && coInitialProduct !== '') {
                    window.twikit.setValue("29-type", coInitialProduct);
                }
            },
            parameterDataReady: function (parameters) {
                // Called when parameter data is ready.
                // 'parameters' is an array of parameter data.
                createProducts(parameters);
            },
            parameterGroupsDataReady: function (parameters) {
                // Called when parameter data is ready.
                // 'parameters' is an array of parameter data.
                // console.log("Parameter groups data ready: ", parameters);
            },
            statusChanged: function (status) {
                // Called while loading the context to report progress.
                // 'status' reports the loading state, either idle(0), loading(1), busy(2), ready(3)
                // console.log("Twikbot status changed: ", status);
            },
            twikbotContextReady: function (internalTwikbotContext) {
                // called when the internal context is ready
                // console.log("Twikbot context ready!");
            },
        },
        {locale: "default"}
    );

    // bind submit button
    document.getElementById("co-configurator-submit").addEventListener("click", function () {
        if (confirm("Are you sure you want to submit the order?") === false) {
            return;
        }

        // disable the button
        document.getElementById("co-configurator-submit").disabled = true;
        document.getElementById("co-configurator-submit").innerText = "Submitting...";

        window.twikit.order().then(function (order) {

            // store the order in a storage
            localStorage.setItem("twikitOrder", JSON.stringify(order));

            twikitOrder = order;
            generatePDF(order).then(() => {
                document.location.href = thankYouPage;
            }).catch(e => {
                alert('We could not generate a PDF for you. Please contact us.');
            });

            // twikitOrder = order;
            // document.getElementById("co-configurator-download").addEventListener("click", function() {
            //     generatePDF(order);
            // });
            // document.getElementById("co-configurator-ui").style.display = "none";
            // document.getElementById("co-configurator-message").style.display = "block";
        });
    });

    function createBreadcrumbs() {
        var parametersGroups = document.getElementsByClassName("twikbot-parameter-group");
        for (var i = 0; i < parametersGroups.length; i++) {
            var group = parametersGroups[i];
            // get the group title (.twikbot-parameter-group-title)
            var title = group.getElementsByClassName("twikbot-parameter-group-title")[0].innerText;

            // generate the breadcrumb
            var breadcrumb = document.createElement("div");
            breadcrumb.classList.add("co-configurator-breadcrumbs-item");
            if (i === 0) {
                breadcrumb.classList.add("active");
            }
            breadcrumb.addEventListener('click', gotoBreadcrumb);
            breadcrumb.innerHTML = '<div class="co-configurator-breadcrumbs-item-label">' + title + '</div><div class="co-configurator-breadcrumbs-item-bar"></div>';

            document.getElementById("co-configurator-breadcrumbs").appendChild(breadcrumb);
        }
    }

    function bindCanvasStickyScroll() {
        // only when the viewport is larger than 1024px
        if (window.innerWidth >= 1024) {
            return;
        }

        // when the body scroll is greater than the initial offset of the canvas container, add a class to the canvas container
        var canvasContainer = document.getElementById("co-configurator-canvas");
        var initialOffset = canvasContainer.offsetTop + 200; // 50px offset to avoid the header
        window.addEventListener("scroll", function () {
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop > initialOffset) {
                canvasContainer.classList.add("co-configurator-canvas-sticky");
            } else {
                canvasContainer.classList.remove("co-configurator-canvas-sticky");
            }
        });
    }

    function setBreadcrumb(e) {
        var currentScrollPos = e.target.scrollTop;
        var parametersGroups = document.getElementsByClassName("twikbot-parameter-group");
        var activeIndexes = [0];
        // loop through all the parameter groups and check if the top position is below the current scroll
        for (var i = 0; i < parametersGroups.length; i++) {
            var group = parametersGroups[i];
            if (group.offsetTop < currentScrollPos) {
                activeIndexes.push(i + 1);
            }
        }

        // set the active class to the breadcrumb with the correct indexes
        var breadcrumbs = document.getElementsByClassName("co-configurator-breadcrumbs-item");
        for (var i = 0; i < breadcrumbs.length; i++) {
            var breadcrumb = breadcrumbs[i];
            if (activeIndexes.includes(i)) {
                breadcrumb.classList.add("active");
            } else {
                breadcrumb.classList.remove("active");
            }
        }
    }

    function gotoBreadcrumb() {

        var label = this.getElementsByClassName("co-configurator-breadcrumbs-item-label")[0].innerText;

        // find the parameter group with the same title
        var group = Array.from(document.getElementsByClassName("twikbot-parameter-group")).find(function (group) {
            return group.getElementsByClassName("twikbot-parameter-group-title")[0].innerText.indexOf(label) > -1;
        });

        // get the window width
        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // scroll to that parameter group
        const scrollContainer = windowWidth < 1024 ? window : document.getElementById('co-configurator-ui');

        scrollContainer.scrollTo({
            top: group.offsetTop - 70, // offset to avoid the header
            behavior: 'smooth' // smooth scroll
        });
    }

    function createProducts(parameters) {
        // loop the parameters object
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i];
            // check if the parameter is a product
            if (parameter.name === "Type") {
                let activeClassFound = false;

                for (var j = 0; j < parameter.options.length; j++) {
                    var option = parameter.options[j];
                    // create a product element
                    var product = document.createElement("button");
                    product.classList.add("co-configurator-product");
                    if (
                        (coInitialProduct === "" && parameter.value === option.value) ||
                        (coInitialProduct !== "" && coInitialProduct === option.value)
                    ) {
                        product.classList.add("active");
                        activeClassFound = true;
                    }

                    const productConfig = findProductConfigByValue(option.value);

                    let html = '<div class="co-configurator-product-image"><img src="' + coImageDir + 'product-' + j + '.png?v=' + new Date() + '" alt="View ' + option.name + '"></div><div class="co-configurator-product-title">' + option.name + '</div>';
                    html += '<div class="co-configurator-product-price">Price from <span class="co-configurator-product-price-value">' + productConfig.priceFrom + '</span></div>';
                    html += '</div>';

                    product.classList.add("product-" + j);
                    product.setAttribute("data-value", option.value);
                    product.setAttribute("data-id", parameter.id);
                    product.innerHTML = html;
                    product.addEventListener("click", function (e) {
                        // remove active class from all the products
                        var products = document.getElementsByClassName("co-configurator-product");
                        for (var i = 0; i < products.length; i++) {
                            products[i].classList.remove('active');
                        }
                        e.currentTarget.classList.add('active')
                        // get data-value attribute of the button
                        var value = e.currentTarget.getAttribute("data-value");
                        var id = e.currentTarget.getAttribute("data-id");
                        window.twikit.setValue(id, value);
                    });
                    document.getElementById("co-configurator-products").appendChild(product);
                }

                if (!activeClassFound) {
                    document.getElementsByClassName("product-0")[0].classList.add("active");
                }
            }
        }
    }

    function setCameraButtons() {

        // camera options
        const select = document.querySelector('.twikbot-parameter-1416-camera');
        const options = document.querySelectorAll('.twikbot-parameter-1416-camera select option');

        // create the camera buttons
        var cameraButtons = document.createElement("div");
        cameraButtons.classList.add("co-configurator-camera-buttons");

        for (let i = 0; i < options.length; i++) {

            // create a button for each option
            const button = document.createElement('button');
            button.classList.add("co-configurator-camera-button");
            if (i === 0) {
                button.classList.add("active");
            }
            button.id = `co-configurator-camera-${options[i].value.toLowerCase()}`;
            button.innerText = options[i].innerText;
            button.addEventListener("click", function () {
                // set the camera view
                window.twikit.setValue("1416-camera", options[i].value);
                select.style.display = "none";

                // remove active class from all buttons
                var buttons = document.getElementsByClassName("co-configurator-camera-button");
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove("active");
                }

                // add active class to the clicked button
                this.classList.add("active");
            });

            // add button to the camera buttons container
            cameraButtons.appendChild(button);
        }

        // add them into the canvas container
        canvasContainer.appendChild(cameraButtons);

        // hide the select element
        select.style.display = "none";
    }

    function setAreaButtons() {

        // camera options
        const select = document.querySelector('.twikbot-parameter-1379-area');
        const options = document.querySelectorAll('.twikbot-parameter-1379-area select option');

        // create the camera buttons
        var container = document.createElement("div");
        container.classList.add("co-configurator-area-buttons");

        for (let i = 0; i < options.length; i++) {

            // create a button for each option
            const button = document.createElement('button');
            button.classList.add("co-configurator-area-button");
            if (i === 0) {
                button.classList.add("active");
            }
            button.id = `co-configurator-area-${options[i].value.toLowerCase()}`;
            button.innerText = options[i].innerText;
            button.addEventListener("click", function () {
                // set the camera view
                window.twikit.setValue("1379-area", options[i].value);
                select.style.display = "none";

                // remove active class from all buttons
                var buttons = document.getElementsByClassName("co-configurator-area-button");
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove("active");
                }

                // add active class to the clicked button
                this.classList.add("active");
            });

            // add button to the camera buttons container
            container.appendChild(button);
        }

        // add them into the canvas container
        canvasContainer.appendChild(container);

        // hide the select element
        select.style.display = "none";
    }

    function setProductInfo(selectedProduct) {
        // set the information about the selected product
        const config = findProductConfigByValue(selectedProduct);

        document.getElementById('co-configurator-product-info')?.remove();
        const productInfo = document.createElement('div');
        productInfo.id = 'co-configurator-product-info';
        productInfo.classList.add('co-configurator-product-info');
        // add the div after the .twikbot-parameter-1319-type
        document.querySelector('.twikbot-parameter-1319-type').insertAdjacentElement('afterend', productInfo);

        document.getElementById("co-configurator-product-info").innerHTML = `
                        <div class="co-configurator-product-info-price">Price: <span class="co-configurator-product-info-price-value">${config.priceFrom}</span></div>
                        <div class="co-configurator-product-info-max-people">Max people standing: ${config.maxPeopleStanding}</div>
                        <div class="co-configurator-product-info-max-people">Max people sitting: ${config.maxPeopleSitting}</div>
                    `;
    }

    function setCategoryTooltips() {
        const categories = document.querySelectorAll('.twikbot-parameter-group-title');
        Array.from(categories).forEach(category => {
            const str = category.innerText.toLowerCase();
            console.log(coCategoryTooltips);
            const tooltipText = coCategoryTooltips[str] ? coCategoryTooltips[str] : '';
            if (tooltipText !== '') {
                const tooltip = document.createElement('span');
                tooltip.classList.add('co-configurator-category-tooltip');
                tooltip.innerText = 'i';
                category.appendChild(tooltip);

                tippy(tooltip, {
                    content: tooltipText,
                    allowHTML: true,
                });
            }
        });

    }

    async function generatePDF(order) {
        if (!twikitOrder) {
            alert("No order found");
            return;
        }
        try {
            const pdfBlob = await window.twikit.generatePDFFromOrder(order);
            downloadFromBlob(pdfBlob, `${order.id}.pdf`);
        } catch (error) {
            alert(error);
        }
    }

    function downloadFromBlob(blob, name) {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
    }

    function findProductConfigByValue(value) {
        // find the correct config in the coProductConfig JSON settings
        const search = value.toLowerCase();
        const productConfig = Object.values(coProductConfig).find(item =>
            search.includes(item.label.toLowerCase())
        );

        // parse int to currency with EUR sign
        const currencyFormat = new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        const priceFrom = currencyFormat.format(productConfig ? parseInt(productConfig.price_from, 10) : 0);

        return {
            priceFrom: priceFrom,
            maxPeopleStanding: productConfig ? productConfig.total_persons_standing : 0,
            maxPeopleSitting: productConfig ? productConfig.total_persons_sitting : 0,
        }
    }
}
