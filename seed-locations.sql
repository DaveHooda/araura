-- Seed accessible Northern hemisphere aurora viewing locations
-- Focus: Easy accessibility, infrastructure, tier 1 & 2 locations

INSERT INTO locations (name, description, latitude, longitude, country, region, tier, bortle_scale, accessibility, amenities, best_months, nearby_city, nearby_airport) VALUES

-- TIER 1: Premium accessible locations with excellent infrastructure
('Tromsø City Center', 'Capital of Northern Norway, known as the Aurora capital. Excellent viewing from city outskirts with full amenities.', 69.6492, 18.9553, 'Norway', 'Troms og Finnmark', 1, 4, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true, "tours": true}', ARRAY[9,10,11,12,1,2,3,4], 'Tromsø', 'Tromsø Airport (TOS)'),

('Reykjavik Area', 'Iceland''s capital region offers accessible aurora viewing just outside the city with excellent tourist infrastructure.', 64.1466, -21.9426, 'Iceland', 'Capital Region', 1, 4, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true, "tours": true}', ARRAY[9,10,11,12,1,2,3,4], 'Reykjavik', 'Keflavik International (KEF)'),

('Fairbanks - Cleary Summit', 'Clear skies and accessible viewing site 20 miles north of Fairbanks with parking and facilities.', 65.2838, -147.4167, 'United States', 'Alaska', 1, 2, 'easy', '{"parking": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Fairbanks', 'Fairbanks International (FAI)'),

('Abisko National Park', 'Famous for the blue hole phenomenon - clear skies even when surrounding areas are cloudy. Tourist facilities available.', 68.3547, 18.8310, 'Sweden', 'Norrbotten', 1, 1, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Abisko', 'Kiruna Airport (KRN)'),

('Rovaniemi - Arctic Circle', 'Santa''s hometown offers aurora tours and viewing spots with full tourist infrastructure.', 66.5039, 25.7294, 'Finland', 'Lapland', 1, 3, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true, "tours": true}', ARRAY[9,10,11,12,1,2,3,4], 'Rovaniemi', 'Rovaniemi Airport (RVN)'),

('Yellowknife - Ingraham Trail', 'Directly under the aurora oval. Multiple accessible viewing spots along the trail with parking.', 62.4540, -114.3718, 'Canada', 'Northwest Territories', 1, 2, 'easy', '{"parking": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Yellowknife', 'Yellowknife Airport (YZF)'),

('Kiruna Town', 'Sweden''s northernmost city with easy access to dark viewing locations and full amenities.', 67.8558, 20.2253, 'Sweden', 'Norrbotten', 1, 3, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Kiruna', 'Kiruna Airport (KRN)'),

('Akureyri Region', 'North Iceland''s second city with accessible viewing areas and excellent infrastructure.', 65.6835, -18.1262, 'Iceland', 'Northeast Region', 1, 3, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Akureyri', 'Akureyri Airport (AEY)'),

('Whitehorse - Fish Lake', 'Capital of Yukon with easy access to dark sites. Fish Lake offers parking and easy viewing.', 60.7212, -135.0568, 'Canada', 'Yukon', 1, 2, 'easy', '{"parking": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Whitehorse', 'Whitehorse Airport (YXY)'),

('Alta Town', 'Northern Norway aurora hub with observatories and tour operators.', 69.9689, 23.2717, 'Norway', 'Troms og Finnmark', 1, 3, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true, "tours": true}', ARRAY[9,10,11,12,1,2,3,4], 'Alta', 'Alta Airport (ALF)'),

-- TIER 2: Good accessible locations with reasonable infrastructure
('Ivalo Region', 'Finnish Lapland with excellent aurora viewing and accessible locations.', 68.6569, 27.5456, 'Finland', 'Lapland', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Ivalo', 'Ivalo Airport (IVL)'),

('Anchorage - Hatchers Pass', 'Accessible mountain pass with parking and stunning aurora views.', 61.7675, -149.2194, 'United States', 'Alaska', 2, 2, 'easy', '{"parking": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Anchorage', 'Anchorage International (ANC)'),

('Narvik Area', 'Northern Norway port city with accessible viewing locations.', 68.4385, 17.4272, 'Norway', 'Nordland', 2, 3, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Narvik', 'Narvik Airport (NVK)'),

('Lulea Region', 'Swedish coastal city with good aurora viewing opportunities.', 65.5848, 22.1547, 'Sweden', 'Norrbotten', 2, 3, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Lulea', 'Lulea Airport (LLA)'),

('Sortland', 'Vesterålen islands in Norway with unique landscape and aurora viewing.', 68.6977, 15.4128, 'Norway', 'Nordland', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Sortland', 'Stokmarknes Airport (SKN)'),

('Keflavik Peninsula', 'Southwest Iceland with easy road access and lower light pollution than Reykjavik.', 64.0049, -22.5636, 'Iceland', 'Southwest', 2, 2, 'easy', '{"parking": true}', ARRAY[9,10,11,12,1,2,3,4], 'Keflavik', 'Keflavik International (KEF)'),

('Penticton - Okanagan Valley', 'Southern British Columbia with good winter viewing opportunities.', 49.4911, -119.5886, 'Canada', 'British Columbia', 2, 3, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Penticton', 'Kelowna Airport (YLW)'),

('Bodø Region', 'Coastal Norwegian city just above Arctic Circle with accessible sites.', 67.2804, 14.4049, 'Norway', 'Nordland', 2, 3, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Bodø', 'Bodø Airport (BOO)'),

('Inari Village', 'Remote Finnish Lapland village with excellent dark skies and Sami culture.', 69.0539, 27.0292, 'Finland', 'Lapland', 2, 1, 'moderate', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Inari', 'Ivalo Airport (IVL)'),

('Murmansk Region', 'Russia''s Arctic port city with aurora viewing opportunities.', 68.9585, 33.0827, 'Russia', 'Murmansk Oblast', 2, 4, 'moderate', '{"parking": true, "accommodation": true}', ARRAY[9,10,11,12,1,2,3,4], 'Murmansk', 'Murmansk Airport (MMK)'),

('Jokkmokk', 'Swedish Lapland town known for winter market and aurora viewing.', 66.6064, 19.8228, 'Sweden', 'Norrbotten', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Jokkmokk', 'Gällivare Airport (GEV)'),

('Talkeetna', 'Charming Alaska town with excellent aurora viewing and accessibility.', 62.3203, -150.1066, 'United States', 'Alaska', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Talkeetna', 'Anchorage International (ANC)'),

('Senja Island', 'Norway''s second largest island with dramatic landscapes and aurora viewing.', 69.3049, 17.9644, 'Norway', 'Troms og Finnmark', 2, 2, 'moderate', '{"parking": true, "accommodation": true}', ARRAY[9,10,11,12,1,2,3,4], 'Senja', 'Bardufoss Airport (BDU)'),

('Lofoten Islands - Reine', 'Picturesque fishing villages with stunning aurora backdrop.', 67.9319, 13.0893, 'Norway', 'Nordland', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Reine', 'Leknes Airport (LKN)'),

('Churchill Area', 'Manitoba''s polar bear capital also offers excellent aurora viewing.', 58.7684, -94.1648, 'Canada', 'Manitoba', 2, 1, 'moderate', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Churchill', 'Churchill Airport (YYQ)'),

('Saariselkä', 'Finnish ski resort with aurora viewing infrastructure.', 68.4167, 27.4167, 'Finland', 'Lapland', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Saariselkä', 'Ivalo Airport (IVL)'),

('Vík í Mýrdal', 'Southern Iceland village with dark skies and easy road access.', 63.4186, -19.0059, 'Iceland', 'South Region', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Vík', 'Keflavik International (KEF)'),

('Fort McMurray Region', 'Northern Alberta with accessible aurora viewing locations.', 56.7267, -111.3790, 'Canada', 'Alberta', 2, 3, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Fort McMurray', 'Fort McMurray Airport (YMM)'),

('Selfoss Area', 'South Iceland town with easy access to dark viewing sites.', 63.9331, -20.9971, 'Iceland', 'South Region', 2, 3, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Selfoss', 'Keflavik International (KEF)'),

('Tromso - Kvaløya Island', 'Island near Tromsø with darker skies and easy ferry access.', 69.7700, 18.5800, 'Norway', 'Troms og Finnmark', 2, 2, 'easy', '{"parking": true}', ARRAY[9,10,11,12,1,2,3,4], 'Tromsø', 'Tromsø Airport (TOS)'),

('Dawson City', 'Historic Yukon gold rush town with excellent dark skies.', 64.0611, -139.4306, 'Canada', 'Yukon', 2, 1, 'moderate', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Dawson City', 'Dawson City Airport (YDA)'),

('Palmer - Matanuska Valley', 'Alaska valley with accessible viewing and parking areas.', 61.5994, -149.1128, 'United States', 'Alaska', 2, 3, 'easy', '{"parking": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Palmer', 'Anchorage International (ANC)'),

('Skagafjörður Region', 'North Iceland fjord region with dark skies and accessibility.', 65.6833, -19.5000, 'Iceland', 'Northwest', 2, 2, 'easy', '{"parking": true, "accommodation": true}', ARRAY[9,10,11,12,1,2,3,4], 'Sauðárkrókur', 'Akureyri Airport (AEY)'),

('Gällivare', 'Swedish mining town in Lapland with aurora viewing opportunities.', 67.1333, 20.6500, 'Sweden', 'Norrbotten', 2, 3, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Gällivare', 'Gällivare Airport (GEV)'),

('Svolvær', 'Main town of Lofoten Islands with amenities and aurora viewing.', 68.2343, 14.5683, 'Norway', 'Nordland', 2, 3, 'easy', '{"parking": true, "accommodation": true, "food": true}', ARRAY[9,10,11,12,1,2,3,4], 'Svolvær', 'Svolvær Airport (SVJ)'),

('Jasper National Park', 'Canadian Rockies dark sky preserve with excellent facilities.', 52.8737, -118.0814, 'Canada', 'Alberta', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Jasper', 'Edmonton International (YEG)'),

('Þingvellir National Park', 'UNESCO site in Iceland with dark skies and easy access.', 64.2559, -21.1300, 'Iceland', 'Southwest', 2, 2, 'easy', '{"parking": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Þingvellir', 'Keflavik International (KEF)'),

('Kittilä - Levi', 'Finnish ski resort with winter aurora viewing opportunities.', 67.8061, 24.8864, 'Finland', 'Lapland', 2, 2, 'easy', '{"parking": true, "accommodation": true, "food": true, "restrooms": true}', ARRAY[9,10,11,12,1,2,3,4], 'Levi', 'Kittilä Airport (KTT)'),

('Longyearbyen', 'Svalbard''s main settlement - northernmost town with aurora viewing (polar night).', 78.2232, 15.6267, 'Norway', 'Svalbard', 2, 1, 'moderate', '{"parking": true, "accommodation": true, "food": true}', ARRAY[10,11,12,1,2], 'Longyearbyen', 'Svalbard Airport (LYR)'),

('Denali Highway', 'Remote Alaska highway with pullouts for aurora viewing.', 63.3947, -147.0439, 'United States', 'Alaska', 2, 1, 'moderate', '{"parking": true}', ARRAY[9,10,11,12,1,2,3,4], 'Cantwell', 'Fairbanks International (FAI)');
