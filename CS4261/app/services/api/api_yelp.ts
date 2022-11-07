/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApisauceInstance,
  create,
} from "apisauce"
import { resetGlobalState } from "mobx/dist/internal";

// API KEY
const api_key = "JJms8_xQqCETmtcpdu8xSTBAlyhy_LjkpzwmKCoeBHqC_LaFJc4BlEQ0G_o-jnVJlPwhLqa9ugPCB5BKWjsCqrrXx0-Oa_fJVRj0QndQGgluTkrh45zmcMB04-xhY3Yx";

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class yelpAPI {
  apisauce: ApisauceInstance

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor() {
    this.apisauce = create({
      baseURL: 'https://api.yelp.com/v3',
      headers: {
        //Accept: "application/json",
        Authorization: "Bearer " + api_key
      },
    });
  }

  /*
    Get list of restaurants from Yelp.

    Useful keys per restaurant object:
      id -> Used to get more detailed info
      name -> Restaurant name
      image_url -> URL to the restaurant image on Yelp
      rating -> Yelp's rating
  */
  async getRestaurants({location = 'Georgia Tech', category = 'food', limit = 20, offset = 0}) {
    // make the api call
    console.log('in function')
    console.log({offset})
    const response = await this.apisauce.get(
      `/businesses/search?location=${location}&category=${category}&limit=${limit}&offset=${offset}`,
    ).then((res) => {
      if (res.status == 200) {
        var businesses = res.data['businesses'];
        return businesses;
      } else {
        console.log("Yelp API Error");
      }
    })
    return response;
  }
}

// Singleton instance of the API for convenience
export const api = new yelpAPI()
