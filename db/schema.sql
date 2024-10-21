CREATE DATABASE servo_spa;

CREATE TABLE petrol_stations (
    ID SERIAL PRIMARY KEY,
    OBJECTID INTEGER,
    FEATURETYPE TEXT,
    DESCRIPTION TEXT,
    CLASS TEXT,
    FID INTEGER,
    NAME TEXT,
    OPERATIONALSTATUS TEXT,
    OWNER TEXT,
    INDUSTRYID INTEGER,
    ADDRESS TEXT,
    SUBURB TEXT,
    STATE TEXT,
    SPATIALCONFIDENCE INTEGER,
    REVISED INTEGER,
    COMMENT TEXT,
    LATITUDE NUMERIC(15,12),
    LONGITUDE NUMERIC(15,12)
);



-- copy from csv to psql 
-- get absolute path from path line of your own  station csv

COPY petrol_stations
        (OBJECTID,
        FEATURETYPE,
        DESCRIPTION,
        CLASS,
        FID,
        NAME,
        OPERATIONALSTATUS,
        OWNER,
        INDUSTRYID,
        ADDRESS,
        SUBURB,
        STATE,
        SPATIALCONFIDENCE,
        REVISED,
        COMMENT,
        LATITUDE,
        LONGITUDE)
        FROM '/Users/bratto/seb/servo-project3/db/stations.csv'
        DELIMITER ','
        CSV HEADER;