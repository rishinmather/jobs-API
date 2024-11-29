// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong , try again later ",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  // duplicate value error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field ,please choose a different value`;
    customError.statusCode = 400;
  }

  // validation error

  if (err.name === "ValidationError") {
    // .values gives the values pair of object key-value and returns objectvalues as array which can be mapped and then pinpoint out to take out message
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  // cast Error:

  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;

// once you have set the app functional with all the job controllers ,you now need to set better error responses for validation(no name ,np password,no email) , duplicate email and cast error(when id syntax is wrong like example when you tested with removinf last id digit)

// Duplicate value error:
// default mongo error for dupilicate email (for your reference as oto where you got err.code===11000 and err.keyvalue )

// {
//     "err": {
//         "errorResponse": {
//             "index": 0,
//             "code": 11000,
//             "errmsg": "E11000 duplicate key error collection: Jobs_api.users index: email_1 dup key: { email: \"sammy1@gmail.com\" }",
//             "keyPattern": {
//                 "email": 1
//             },
//             "keyValue": {
//                 "email": "sammy1@gmail.com"
//             }
//         },
//         "index": 0,
//         "code": 11000,
//         "keyPattern": {
//             "email": 1
//         },
//         "keyValue": {
//             "email": "sammy1@gmail.com"
//         }
//     }
// }

// validation error (error when missing any fields like name,email ,pasword)

// "err": {
//         "errors": {
//             "password": {
//                 "name": "ValidatorError",
//                 "message": "Please provide password",
//                 "properties": {
//                     "message": "Please provide password",
//                     "type": "required",
//                     "path": "password"
//                 },
//                 "kind": "required",
//                 "path": "password"
//             },
//             "email": {
//                 "name": "ValidatorError",
//                 "message": "Please provide email",
//                 "properties": {
//                     "message": "Please provide email",
//                     "type": "required",
//                     "path": "email"
//                 },
//                 "kind": "required",
//                 "path": "email"
//             }
//         },
//         "_message": "User validation failed",
//         "name": "ValidationError",
//         "message": "User validation failed: password: Please provide password, email: Please provide email"
//     }
// }

// cast error:

// {
//     "err": {
//         "stringValue": "\"673725c9c013db68c5139a7\"",
//         "valueType": "string",
//         "kind": "ObjectId",
//         "value": "673725c9c013db68c5139a7",
//         "path": "_id",
//         "reason": {},
//         "name": "CastError",
//         "message": "Cast to ObjectId failed for value \"673725c9c013db68c5139a7\" (type string) at path \"_id\" for model \"Job\""
//     }
// }

// SECURTY PACKAGES:

// helmet :sets http headers to prevent attacks
// cors:allows aoi to be used in different platforms
// xss-clean:sanitizes req.body,params,queries etc
// express-rate-limit-sets limit to api requests
