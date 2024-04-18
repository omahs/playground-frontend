import { 
    testAdd,
    testFetchOverride
} from "./test.functions";

function executeFunction(functionString) {

    try {
        let fn = new Function('return ' + functionString)();
        fn(3,4)
        console.log(`Result: ${fn(1, 2)}`);  // Example execution with dummy data
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

function removeNonUsedCode(codeString) {
    const regex = /\/\* Do not change anything above this line \*\/\s*([\s\S]*?)\s*\/\* Do not change anything below this line \*\//;
    const matches = codeString.match(regex);
    const content = matches ? matches[1].trim() : '';
    return content
}

// This returns a function that allows you to override params 
// let foo = createDynamicFunctionBuilder(functionString)
// will produce a function let bar = foo({wordToOverride : 3})
// bar(x,y,z) // regular function script call
function createDynamicFunctionBuilder(functionString) {
    return function(overrides, ...args) {
      let overridesCode = "";
      for (const key in overrides) {
        if (typeof overrides[key] === 'function') {
            overridesCode += `let ${key} = ${overrides[key].toString()};\n`;
        } else {
            overridesCode += `let ${key} = ${JSON.stringify(overrides[key])};\n`;
        }
      }
  
      const fullFunctionCode = overridesCode + "return " + functionString;
  
      try {
        const dynamicFn = eval(`(function() { ${fullFunctionCode} })`);
        return dynamicFn.apply(this, args);
      } catch (error) {
        console.error(`Error executing function: ${error.message}`);
        return null;
      }
    };
  }

async function runTests(functionName, functionReference) {
    console.log(":: Running Tests")

    switch (functionName) {
        case 'add':
            await testAdd(functionReference)
            break;
        case 'fetchOverride':
            await testFetchOverride(functionReference);
            break;
        case 'orange':
            console.log('Orange was chosen.');
            break;
        default:
            console.log('No valid fruit was chosen.');
    }
}

async function test(functionName, fullCodeString) {
    let codeString = removeNonUsedCode(fullCodeString)
    let generator = createDynamicFunctionBuilder(codeString)
    await runTests(functionName, generator)
}

export {
    test
}