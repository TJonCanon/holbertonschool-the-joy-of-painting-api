-- Create Date Table
CREATE TABLE Date (
    date_id SERIAL PRIMARY KEY,
    month VARCHAR(20),
    year INT
);

-- Create Episode Table
CREATE TABLE Episode (
    episode_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    duration INT,
    original_air_date_id INT REFERENCES Date(date_id)
);

-- Create Painting Table
CREATE TABLE Painting (
    painting_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subject_matter VARCHAR(255),
    color_palette VARCHAR(255),
    episode_id INT REFERENCES Episode(episode_id)
);
