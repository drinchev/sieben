(function() {

    /**
     * First we prevent scrolling
     */
    document.body.addEventListener( "touchmove", function( event ) {
        event.preventDefault()
    } );

    /**
     * Declare the operations we have on our screen
     */
    var operations       = [],
        isTouch          = "ontouchstart" in window || navigator["maxTouchPoints"],
        screenEventStart = isTouch ? "touchstart" : "mousedown",
        screenEventEnd   = isTouch ? "touchend" : "mouseup",
        elScreen         = document.getElementById( "screen" ),
        elButtons        = document.getElementsByTagName( "button" ),
        elClear          = document.getElementById( "clear" ),
        regExpNumber     = "(\\d+(\\.\\d+)?)",
        operators        = {
            "÷" : new RegExp( regExpNumber + "÷" + regExpNumber ),
            "x" : new RegExp( regExpNumber + "x" + regExpNumber ),
            "+" : new RegExp( regExpNumber + "\\+" + regExpNumber ),
            "-" : new RegExp( regExpNumber + "-" + regExpNumber )
        };

    /**
     * Updates the screen value
     */
    function updateScreen() {

        /** The value that the screen will become */
        var value = "";

        /** Parse all operations */
        operations.forEach( function( operation ) {

            /** If we have a special operation execute it */
            switch ( operation.value ) {
                case "divide" :
                    value += "÷";
                    break;
                case "multiply" :
                    value += "x";
                    break;
                case "plus" :
                    value += "+";
                    break;
                case "minus" :
                    value += "-";
                    break;
                default :
                    value += operation.value;
            }

        } );

        /** Update the screen value */
        elScreen.innerHTML = value || "0";

        /** Set the proper font-size */
        if ( elScreen.innerHTML.length > 7 ) {
            elScreen.classList.add( "is-small" );
        } else {
            elScreen.classList.remove( "is-small" );
        }

    }

    /**
     * Calculate result as string
     */
    function calculateResult() {

        var expression = elScreen.innerHTML.replace( /,/g, "." ),
            operations = ["÷", "x", "+", "-"],
            operation  = 0;

        function recurse( expression ) {

            /** Next operation if we reached the final one */
            if ( expression.indexOf( operations[operation] ) === -1 ) {
                if ( operations.length - 1 === operation ) {
                    return expression;
                } else {
                    operation++;
                    return recurse( expression );
                }
            }

            if ( expression.indexOf( operations[operation] ) === expression.length - 1 ) {
                return recurse( expression.slice(0, -1) );
            }

            return recurse(
                expression.replace(
                    operators[operations[operation]],
                    function( match, p1, p2, p3 ) {

                        var a = parseFloat( p1 ),
                            b = parseFloat( p3 );

                        switch ( operation ) {
                            case 0:
                                return a / b;
                            case 1:
                                return a * b;
                            case 2:
                                return a + b;
                            case 3:
                                return a - b;
                        }

                    }
                )
            );

        }

        return recurse( expression );

    }

    /**
     * Handle number button
     */
    function handleDigit( number ) {

        var lastOperation = operations[operations.length - 1];

        /** If the last operation is a number then add to that number */
        if ( lastOperation && lastOperation["type"] === "number" ) {
            lastOperation["value"] += number
        } else {
            operations.push( { type : "number", value : number } );
        }

    }

    /**
     * Handle operation
     */
    function handleOperation( operation ) {

        /** Clear button */
        if ( operation === "clear" ) {
            if ( elClear.innerHTML === "C" ) {
                elClear.innerHTML = "AC";
                operations.pop();
            } else {
                operations = [];
            }
            return;
        }

        /** Handle result */
        if ( operation === "result" ) {
            operations = [
                {
                    type : "number",
                    value : calculateResult()
                }
            ];
            return;
        }

        /** Get the last operation */
        var lastOperation = operations[operations.length - 1];

        /** Handle dot button */
        if ( operation === "dot" ) {
            if ( lastOperation && lastOperation['type'] === "number" ) {
                if ( lastOperation["value"].charAt(
                        lastOperation["value"].length - 1
                    ) !== "," ) {
                    lastOperation['value'] += ","
                }
            } else {
                operations.push( { type : "number", value : "0," } );
            }
            return;
        }

        /** Handle plusminus */
        if ( operation === "plusminus" ) {
            if ( lastOperation && lastOperation['type'] === "number" ) {
                if ( lastOperation["value"].charAt( 0 ) === "-" ) {
                    lastOperation["value"] = lastOperation["value"].replace( /^-/, "" );
                } else {
                    lastOperation["value"] = "-" + lastOperation["value"];
                }
            }
            return;
        }

        /** Handle percent */
        if ( operation === "percent" ) {
            if ( lastOperation && lastOperation["type"] === "number" ) {

                var lOp = operations.pop();

                updateScreen();

                var coefficient = parseFloat( lOp["value"].replace( /,/g, "." ) ) / 100,
                    result      = parseFloat( calculateResult() );

                /** Add the final result */
                operations.push( {
                    type : "number", value : (result * coefficient).toString()
                } );

            }
            return;
        }

        /** Handle +, -, /, * */
        if ( lastOperation && lastOperation['type'] === "operation" ) {
            lastOperation['value'] = operation
        } else {
            operations.push( { type : "operation", value : operation } );
        }

    }

    /**
     * Attach event handlers for buttons
     */
    for ( var i = 0; i < elButtons.length; i++ ) {
        (function( button ) {

            /** Get the attributes we care */
            var digit     = button.getAttribute( "data-digit" ),
                operation = button.getAttribute( "data-operation" );

            /** Do nothing if this button is not declared with data prop */
            if ( !digit && !operation ) { return; }

            button.addEventListener( screenEventStart, function( event ) {

                /** Handle digit button */
                if ( digit ) { handleDigit( digit ); }

                /** Handle operation button */
                if ( operation ) { handleOperation( operation ); }

                /** Update screen */
                updateScreen();

                /** Clear button will be changed to last operation */
                if ( operation !== "clear" ) { elClear.innerHTML = "C"; }

                /** Prevent default from touch */
                event.preventDefault();

                /** Make the button look as touched */
                button.classList.add( "is-touched" );

            }, false );

            button.addEventListener( screenEventEnd, function( event ) {

                /** Prevent default event from release touch */
                event.preventDefault();

                /** Remove the button touched class */
                button.classList.remove( "is-touched" );

            }, false );

        })( elButtons[i] );
    }

})();
