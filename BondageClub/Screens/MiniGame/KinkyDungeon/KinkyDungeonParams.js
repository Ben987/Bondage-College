"use strict";
var KinkyDungeonMapParams = [
	{
		"openness" : 3, // Openness of rooms
		"density" : 3, // Density of tunnels (inverse of room spawn chance)
		"doodadchance" : 0.16,
		"brightness" : 8,
		"chestcount" : 2,
		"shrinecount" : 4,
		"shrinechance" : 0.75,
		"doorchance" : 0.67,
		"rubblechance" : 0.7,
		
		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 11,
		"max_height" : 19,
		
		"enemytags": ["zombie"],
		"shrines": [
			{Type: "Charms", Weight: 9},
			{Type: "Leather", Weight: 6},
			{Type: "Metal", Weight: 3},
			{Type: "Will", Weight: 10},]
		
	},
	{
		"openness" : 0,
		"density" : 2,
		"doodadchance" : 0.11,
		"brightness" : 6,
		"chestcount" : 3,
		"shrinecount" : 5,
		"shrinechance" : 0.6,
		"doorchance" : 0.9,
		"rubblechance" : 0.6,
		
		"min_width" : 21,
		"max_width" : 27,
		"min_height" : 11,
		"max_height" : 17,
	},
	{
		"openness" : 2,
		"density" : 5,
		"doodadchance" : 0.15,
		"brightness" : 7,
		"chestcount" : 4,
		"shrinecount" : 5,
		"shrinechance" : 0.4,
		"doorchance" : 0.2,
		"rubblechance" : 0.5,
		
		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 11,
		"max_height" : 19,
	},
	{
		"openness" : 2,
		"density" : 0,
		"doodadchance" : 0.13,
		"brightness" : 8,
		"chestcount" : 4,
		"shrinecount" : 4,
		"shrinechance" : 0.5,
		"doorchance" : 0.9,
		"rubblechance" : 0.7,
		
		"min_width" : 31,
		"max_width" : 35,
		"min_height" : 13,
		"max_height" : 21,
		
		"lockmult" : 1.5,
	},
	{
		"openness" : 4,
		"density" : 4,
		"doodadchance" : 0.15,
		"brightness" : 7,
		"chestcount" : 5,
		"shrinecount" : 5,
		"shrinechance" : 0.8,
		"doorchance" : 0.05,
		"rubblechance" : 0.9,
		
		"min_width" : 15,
		"max_width" : 25,
		"min_height" : 15,
		"max_height" : 25,
	},
	{
		"openness" : 1,
		"density" : 1,
		"doodadchance" : 0.05,
		"brightness" : 8,
		"chestcount" : 5,
		"shrinecount" : 4,
		"shrinechance" : 0.75,
		"doorchance" : 0.67,
		"rubblechance" : 0.7,
		
		"min_width" : 25,
		"max_width" : 51,
		"min_height" : 9,
		"max_height" : 15,
		
		"lockmult" : 2.0,
	},
	{
		"openness" : 4,
		"density" : 2,
		"doodadchance" : 0.13,
		"brightness" : 5,
		"chestcount" : 5,
		"shrinecount" : 6,
		"shrinechance" : 0.5,
		"doorchance" : 0.0,
		"rubblechance" : 0.3,
		
		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 17,
		"max_height" : 25,
	},
	{
		"openness" : 2,
		"density" : 1,
		"doodadchance" : 0.12,
		"brightness" : 4,
		"chestcount" : 5,
		"shrinecount" : 5,
		"shrinechance" : 0.8,
		"doorchance" : 0.8,
		"rubblechance" : 0.5,
		
		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 11,
		"max_height" : 19,
		
		"lockmult" : 2.0,
	},
	{
		"openness" : 4,
		"density" : 0,
		"doodadchance" : 0.12,
		"brightness" : 8,
		"chestcount" : 6,
		"shrinecount" : 4,
		"shrinechance" : 0.75,
		"doorchance" : 1.0,
		"rubblechance" : 0.7,
		
		"min_width" : 15,
		"max_width" : 21,
		"min_height" : 25,
		"max_height" : 37,
		
		"lockmult" : 1.5,
	},
	{
		"openness" : 2,
		"density" : 1,
		"doodadchance" : 0.08,
		"brightness" : 4,
		"chestcount" : 6,
		"shrinecount" : 3,
		"shrinechance" : 0.75,
		"doorchance" : 1.0,
		"rubblechance" : 0.6,
		
		"min_width" : 25,
		"max_width" : 31,
		"min_height" : 11,
		"max_height" : 19,
		
		"lockmult" : 4.0,
	},
	{
		"openness" : 10,
		"density" : 0,
		"doodadchance" : 0.05,
		"brightness" : 100,
		"chestcount" : 0,
		"shrinecount" : 0,
		"shrinechance" : 0,
		"doorchance" : 1.0,
		"rubblechance" : 1.0,
		
		"min_width" : 31,
		"max_width" : 31,
		"min_height" : 19,
		"max_height" : 19,
		
		"lockmult" : 0.0,
	},
	
];