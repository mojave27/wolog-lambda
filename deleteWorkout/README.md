# wolog-lambda-delete-workout

## manual setup - lambda
1. create a lambda function in the AWS console
1. in this project, run `npm run zip`
1. in the AWS console, upload the zip file to the lambda function
1. in the AWS console, save and deploy

## manual setup - API gateway
1. in AWS console, in wolog api, create `DELETE` method in the `workouts/{id}` resource
1. in Method Request, set Authorization to `wolog` (this will ensure the user is auth'd to the cognito user pool)
1. in Integration Request
   1. do **NOT** check Use Lambda Proxy Integration.
   1. in URL Path Parameters: 
      1. click Add Path
      1. set Name to `id`
      1. set Mapped From to `method.request.path.id`
   1. in Mapping Templates
      1. click 'Add Mapping Template'
      1. set Content-Type to `application/json`
      1. in the dialog dropdown, select `Method Request Passthrough` - this will result in the request object being mapped to various fields in the `event` object, which is available in the lambda function.  e.g., the `id` from the path, will be available at `event.params.path.id`

