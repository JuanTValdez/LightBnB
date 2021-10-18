const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
});

/// Users

const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (email == null) {
        console.log('email cannot be null!!');
        // return result.rows;
      } else {
        console.log(result.rows[0]);
        return result.rows[0];
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (id == null) {
        console.log('User id cannot be null!');
        return result.rows[0];
      } else {
        return result.rows[0];
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function (user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [`${user.name}`, `${user.email}`, `${user.password}`]
    )
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getFulfilledReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating, count(property_reviews.rating) as review_count
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const params = [guest_id, limit];
  return pool.query(queryString, params).then((res) => res.rows);
};
exports.getFulfilledReservations = getFulfilledReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>} A promise to the properties.
 */

const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
SELECT properties.*, avg(property_reviews.rating) as average_rating, count(property_reviews.rating) as review_count
FROM properties
JOIN property_reviews ON properties.id = property_id
`;
  if (options.city) {
    queryParams.push(`%${options.city}%`);

    if (`${queryParams.length}` >= 0) {
      queryString += `WHERE city LIKE $${queryParams.length} `;
    } else {
      queryString += `AND city LIKE $${queryParams.length}`;
    }
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);

    if (`${queryParams.length}` === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length}`;
    }
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);

    if (`${queryParams.length}` === 1) {
      queryString += `WHERE cost_per_night >= $${queryParams.length} `;
    } else {
      queryString += ` AND cost_per_night >= $${queryParams.length}`;
    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);

    if (`${queryParams.length}` === 1) {
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += ` AND cost_per_night <= $${queryParams.length}`;
    }
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);

    if (`${queryParams.length}` === 1) {
      queryString += `WHERE rating >= $${query.Params.length}`;
    } else {
      queryString += ` AND rating >= $${queryParams.length}`;
    }
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = function (property) {
  console.log('hi: ', property);

  return pool
    .query(
      `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        `${property.owner_id}`,
        `${property.title}`,
        `${property.description}`,
        `${property.thumbnail_photo_url}`,
        `${property.cover_photo_url}`,
        `${property.cost_per_night}`,
        `${property.street}`,
        `${property.city}`,
        `${property.province}`,
        `${property.post_code}`,
        `${property.country}`,
        `${property.parking_spaces}`,
        `${property.number_of_bathrooms}`,
        `${property.number_of_bedrooms}`,
      ]
    )
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;

const addReservation = function (reservation) {
  console.log('Reservation: ', reservation);
  return pool
    .query(
      `
    INSERT INTO reservations (start_date, end_date, property_id, guest_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `,
      [
        reservation.start_date,
        reservation.end_date,
        reservation.property_id,
        reservation.guest_id,
      ]
    )
    .then((res) => res.rows[0])
    .catch((err) => {
      console.log(err.message);
    });
};

exports.addReservation = addReservation;

//
//  Gets upcoming reservations
//
const getUpcomingReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating, count(property_reviews.rating) as review_count
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const params = [guest_id, limit];
  return pool.query(queryString, params).then((res) => res.rows);
};

exports.getUpcomingReservations = getUpcomingReservations;

const getIndividualReservation = function (reservationId) {
  const queryString = `SELECT * FROM reservations WHERE reservations.id = $1`;
  return pool.query(queryString, [reservationId]).then((res) => res.rows[0]);
};

exports.getIndividualReservation = getIndividualReservation;

//
//  Updates an existing reservation with new information
//
const updateReservation = function (reservationData) {
  // base string
  let queryString = `UPDATE reservations SET `;
  const queryParams = [];
  if (reservationData.start_date) {
    queryParams.push(reservationData.start_date);
    queryString += `start_date = $1`;
    if (reservationData.end_date) {
      queryParams.push(reservationData.end_date);
      queryString += `, end_date = $2`;
    }
  } else {
    queryParams.push(reservationData.end_date);
    queryString += `end_date = $1`;
  }
  queryString += ` WHERE id = $${queryParams.length + 1} RETURNING *;`;
  queryParams.push(reservationData.reservation_id);
  console.log(queryString);
  return pool
    .query(queryString, queryParams)
    .then((res) => res.rows[0])
    .catch((err) => console.error(err));
};

exports.updateReservation = updateReservation;

//
//  Deletes an existing reservation
//
const deleteReservation = function (reservationId) {
  const queryParams = [reservationId];
  const queryString = `DELETE FROM reservations WHERE id = $1`;
  return pool
    .query(queryString, queryParams)
    .then(() => console.log('Successfully deleted!'))
    .catch(() => console.error(err));
};

exports.deleteReservation = deleteReservation;

const getReviewsByProperty = function (propertyId) {
  const queryString = `
    SELECT property_reviews.id, property_reviews.rating AS review_rating, property_reviews.message AS review_text, 
    users.name, properties.title AS property_title, reservations.start_date, reservations.end_date
    FROM property_reviews
    JOIN reservations ON reservations.id = property_reviews.reservation_id  
    JOIN properties ON properties.id = property_reviews.property_id
    JOIN users ON users.id = property_reviews.guest_id
   WHERE properties.id = $1
    ORDER BY reservations.start_date ASC;
  `;
  const queryParams = [propertyId];
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getReviewsByProperty = getReviewsByProperty;

const addReview = function (review) {
  const queryString = `
    INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryParams = [
    review.guest_id,
    review.property_id,
    review.id,
    parseInt(review.rating),
    review.message,
  ];
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.addReview = addReview;
