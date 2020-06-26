// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  TOAST_SETTINGS:{
    position: 'bottom',
    duration: 3000,
    showCloseButton: false,
    // translucent:true,
    cssClass: 'cm-info-toast'
  },
  LOADER_SETTINGS:{
    duration:30000,
    cssClass: 'cm-loader'
  },
  BASE_URL:'http://localhost:3000/',
  API_USER_TYPES: 'userTypes',
  API_USERS: 'users',
  API_PROFILE: 'userid',
  API_DEALERS: 'dealers',
  API_DELIVERYS: 'delivery',
  API_CARS: 'cars',
  API_CARS_USERS: 'cars_userid',
  API_FEEDBACKS: 'feedbacks',
  API_ORDERS: 'orders',
  API_ORDERS_USERID: 'orders_userid',
  API_CREDS: 'users_credentials',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
