INSERT INTO users (id, name, email, password) 
VALUES 
(1, 'Macho Man Randy Savage', 'Youaintgoinnowhere@ohyeah.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Mr. T', 'ipitythefool@rockybalboa#1.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Sheldon Cooper', 'bazinga@annoyingcharacter.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
(4, 'DJ Khalid', 'djkhalid@wedatbest.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), 
(5, 'Forest Gump', 'bubbashrimp@stupidisstupiddoes.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
(1,5, 'Mommas Old House', 'description','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 395, 2, 4,7,'USA', 'Chocolate Street', 'Smalltown', 'Alabama', '27317', true),

(2, 2, 'The A-Team Chateau', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 199, 2,2,4,'France','Paris Street','Paris', 'Île-de-France', 'EU999', true),

(3, 5, 'Jenny', 'description','https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 495, 4,6,8, 'USA', 'Jenny Street', 'Mobile','Alabama', '83007',false ),

(4, 1, 'Slim Jims Paradise', 'description','https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg',543, 3,3,4,'USA','High Street','Columbus','Ohio','43131', true),

(5, 3, 'Fountain of Youth', 'description','https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg', 99,1, 3, 3, 'USA', 'Looks Super Young Street', 'Pasadena', 'California','16099', false);

INSERT INTO reservations (id, start_date, end_date, property_id,guest_id)
VALUES
(1, '2018-09-11', '2018-09-26',1,5),
(2, '2019-01-04', '2019-02-01',2,4),
(3, '2021-10-01', '2021-10-14',3,3),
(4, '2014-10-21', '2014-10-21',4,2),
(5, '2016-07-17', '2016-08-01',5,1);

INSERT INTO property_reviews(id, guest_id, property_id, reservation_id, rating, message)
VALUES
(1,5,1,1,1,'message'),
(2,4,2,2,2,'message'),
(3,3,3,3,3,'message'),
(4,2,4,4,4,'message'),
(5,1,5,5,5,'message');