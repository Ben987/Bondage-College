"use strict";

/**
 * Female3	CGExtended.js
 * ---------------------
 * This file contains definitions and configuration for extended items. Items which are marked as Extended in
 * `Female3DCG.js` and which have an extended item definition here will have their load/draw/click functions
 * _automatically_ created when assets are loaded, saving the need for an individual extended item script.
 *
 * Currently, modular and typed items are supported, and this is likely to expand in the future.
 */

/**
 * An enum encapsulating the available extended item archetypes
 * MODULAR - Indicates that this item is modular, with several independently configurable modules
 * @enum {string}
 * @see {@link ModularItemConfig}
 * @see {@link TypedItemConfig}
 */
const ExtendedArchetype = {
	MODULAR: "modular",
	TYPED: "typed",
};

/**
 * An object containing all extended item configurations.
 * @type {ExtendedItemConfig}
 * @const
 */
var AssetFemale3DCGExtended = {
	Cloth: {
		TShirt2: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Plain",
						Property: { Type: null, },
					},
					{
						Name: "BCLogo",
						Property: {
							Type: "BCLogo",
							DefaultColor: "#FFF0CC",
						},
					},
					{
						Name: "BDSM",
						Property: {
							Type: "BDSM",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Gag",
						Property: {
							Type: "Gag",
							DefaultColor: "Default",
						},
					},
					{
						Name: "Knot",
						Property: {
							Type: "Knot",
							DefaultColor: "#CCC088",
						},
					},
					{
						Name: "Rock",
						Property: {
							Type: "Rock",
							DefaultColor: "#B03030",
						},
					},
					{
						Name: "Smile",
						Property: {
							Type: "Smile",
							DefaultColor: "#BB9911",
						},
					},
					{
						Name: "Tick",
						Property: {
							Type: "Tick",
							DefaultColor: "#119977",
						},
					},
				],
			},
		}, // TShirt2
		ChineseDress2: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Red",
						Property: { Type: null},
					},
					{
						Name: "Purple",
						Property: { Type: "Purple"},
					},
					{
						Name: "Pink",
						Property: { Type: "Pink"},
					},
				],		
			},
		}, // ChineseDress2
	}, // Cloth
	ClothAccessory: {
		LeatherStraps: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemArms", AssetName: "LeatherArmbinder" },
			Config: {
				Options: [
					{
						Name: "WrapStrap",
						Property: { Type: null, },
					},
					{
						Name: "Strap",
						Property: { Type: "Strap", },
					},
				],
			},
		}, // LeatherStraps
		BunnyCollarCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Both",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Collar",
						Property: {
							Type: "Collar",
						},
					},
					{
						Name: "Cuffs",
						Property: {
							Type: "Cuffs",
						},
					},
				],
			},
		}, // BunnyCollarCuffs
	}, // ClothAccessory
	ItemBreast: {
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "LightWrap",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "LightWrapBow",
						Property: { Type: "LightWrapBow", Difficulty: 1 },
					},
					{
						Name: "Wrap",
						Property: { Type: "Wrap", Difficulty: 2 },
					},
				],
				Dialog: {
					Load: "SelectRibbonType",
					TypePrefix: "RibbonsStyle",
					ChatPrefix: "RibbonsSet",
					NpcPrefix: "ItemBreastRibbons",
				},
			}
		}, // Ribbons
	}, // ItemBreast
	ItemArms: {
		InflatableStraightLeotard: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Light",
						Property: {
							Type: null,
							Effect: ["Block", "Prone"],
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							Effect: ["Block", "Prone"],
							Difficulty: 1,
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							Effect: ["Block", "Prone"],
							Difficulty: 2,
						},
					},
					{
						Name: "Max",
						Property: {
							Type: "Max",
							Effect: ["Block", "Prone", "Freeze"],
							Difficulty: 3,
						},
					},
				],
				Dialog: {
					Load: "SelectInflationLevel",
					TypePrefix: "InflationAmount",
					ChatPrefix: "InflationAmountSet",
					NpcPrefix: "ItemArmsInflatableStraightLeotard",
				},
			}
		}, // InflatableStraightLeotard
		MetalCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "InFront",
						Property: {
							Type: "InFront",
							SetPose: ["BaseUpper"],
						}
					},
					{
						Name: "BehindBack",
						Property: {
							Type: null,
							SetPose: ["BackCuffs"],
						}
					}
				],
				Dialog: {
					Load: "SelectBondagePosition",
					TypePrefix: "MetalCuffsPose",
					ChatPrefix: "MetalCuffsRestrain",
					NpcPrefix: "ItemArmsMetalCuffs",
				},
			}
		}, // MetalCuffs
		Chains: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
						{
							Name: "WristTie",
							BondageLevel: null,
							Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
							Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
						}, {
							Name: "BoxTie",
							BondageLevel: null,
							Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 }
						}, {
							Name: "ChainCuffs",
							BondageLevel: null,
							Property: { Type: "ChainCuffs", Effect: ["Block", "Prone"], SetPose: ["BackCuffs"], Difficulty: 1, OverridePriority: 29 },
							Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
						}, {
							Name: "WristElbowTie",
							BondageLevel: 2,
							Property: { Type: "WristElbowTie", Effect: ["Block", "Prone", "NotSelfPickable"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
							Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
						}, {
							Name: "WristElbowHarnessTie",
							BondageLevel: 3,
							Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone", "NotSelfPickable"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
							Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
						}, {
							Name: "KneelingHogtie",
							BondageLevel: 4,
							Prerequisite: ["NotMounted", "NotSuspended"],
							Property: { Type: "KneelingHogtie", Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3 },
							Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
							SelfBlockCheck: true,
							Random: false,
						}, {
							Name: "Hogtied",
							BondageLevel: 4,
							Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
							Property: { Type: "Hogtied", Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied"], Difficulty: 3 },
							Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
							SelfBlockCheck: true,
							Random: false,
						}, {
							Name: "AllFours",
							BondageLevel: 6,
							Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
							Property: { Type: "AllFours", Effect: ["ForceKneel", "NotSelfPickable"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],  AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["AllFours"], Difficulty: 3 },
							Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
							SelfBlockCheck: true,
							Random: false,
						}, {
							Name: "SuspensionHogtied",
							BondageLevel: 8,
							Prerequisite: ["NotMounted", "NotChained", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
							Property: { Type: "SuspensionHogtied", Effect: ["Block", "Freeze", "Prone", "NotSelfPickable"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied", "SuspensionHogtied"], Difficulty: 6,
								OverrideHeight: { Height: 0, Priority: 51, HeightRatioProportion: 0 } },
							Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
							Random: false,
						}
				],
				Dialog: {
					Load: "SelectChainBondage",
					TypePrefix: "ChainBondage",
					ChatPrefix: "ArmsChainSet",
					NpcPrefix: "ChainBondage",
				},
				ChangeWhenLocked: false,
			}
		}, // Chains
		HighSecurityStraitJacket: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Crotch", Key: "c",
						Options: [
							{}, // c0 - No crotch panel
							{ // c1 - Crotch panel
								Property: {
									Difficulty: 1,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulva", "ItemVulvaPiercings"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
						],
					},
					{
						Name: "Arms", Key: "a",
						Options: [
							{}, // a0 - Arms loose
							{ Property: { Difficulty: 2 }, SelfBondageLevel: 8 }, // a1 - Arms in front
							{ Property: { Difficulty: 3 }, SelfBondageLevel: 8 }, // a2 - Arms behind
						],
					},
					{
						Name: "Straps", Key: "s",
						Options: [
							{}, // s0 - No crotch straps
							{ // s1 - One crotch strap
								Property: {
									Difficulty: 1,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulvaPiercings"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
							{ Property: { Difficulty: 2, Block: ["ItemPelvis"] } }, // s2 - Two crotch straps
							{ // s3 - Three crotch straps
								Property: {
									Difficulty: 2,
									Block: ["ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
									Hide: ["ItemVulvaPiercings"],
									HideItem: ["ItemButtAnalBeads2"],
								},
							},
						],
					},
				],
				ChangeWhenLocked: false,
			},
		}, // HighSecurityStraitJacket
		LatexButterflyLeotard: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Unpolished",
						Property: { Type: null },
					},
					{
						Name: "Polished",
						Property: { Type: "Polished" },
					},
				],
				Dialog: {
					Load: "ItemArmsLatexLeotardSelect",
					TypePrefix: "ItemArmsLatexLeotard",
					ChatPrefix: "ItemArmsLatexLeotardSet",
				},
			},
		}, // LatexButterflyLeotard
		LatexBoxtieLeotard: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LatexButterflyLeotard" },
		},
		LatexSleevelessLeotard: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LatexButterflyLeotard" },
		},
		CeilingShackles: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "HeadLevel",
						Property: {
							Type: null,
							SetPose: ["Yoked"]
						},
					},
					{
						Name: "Overhead",
						Property: {
							Type: "Overhead",
							SetPose: ["OverTheHead"]
						},
					},
				],
				Dialog: {
					Load: "SelectBondagePosition",
					ChatPrefix: ({ C }) => `ItemArmsCeilingShacklesSet${C.Pose.includes("Suspension") ? "Suspension" : ""}`
				},
			},
		}, // CeilingShackles
		BitchSuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Latex",
						Property: {
							Type: null,
							Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
						},
					},
					{
						Name: "UnZip",
						Property: {
							Type: "UnZip",
							Block: [],
						},
					},
				],
			},
		}, // BitchSuit
		LeatherArmbinder: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "Strap",
						Property: { Type: "Strap", Difficulty: 3 },
					},
					{
						Name: "WrapStrap",
						Property: { Type: "WrapStrap", Difficulty: 3 },
					},
				],
				Dialog: {
					Load: "ItemArmsLeatherArmbinderSelect",
					TypePrefix: "ItemArmsLeatherArmbinder",
					ChatPrefix: "ItemArmsLeatherArmbinderSet",
				},
			},
		}, // LeatherArmbinder
		WristShackles: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "InFront",
						Property: {
							Type: null
						},
					},
					{
						Name: "Behind",
						Property: {
							Type: "Behind",
							SetPose: ["BackCuffs"],
							Effect: ["Block", "Prone"],
							Difficulty: 3
						},
					},
					{
						Name: "Overhead",
						Property: {
							Type: "Overhead",
							SetPose: ["OverTheHead"],
							Effect: ["Block", "Prone"],
							Difficulty: 3
						},
					},
				],
				Dialog: {
					Load: "SelectBondagePosition",
				}
			},
		}, // WristShackles
		LeatherCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: {
							Type: null,
							Difficulty: 0,
							Effect: [],
							SetPose: null,
							SelfUnlock: true,
						},
					},
					{
						Name: "Wrist",
						Property: {
							Type: "Wrist",
							Difficulty: 2,
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							SelfUnlock: true,
						},
					},
					{
						Name: "Elbow",
						Property: {
							Type: "Elbow",
							Difficulty: 4,
							Effect: ["Block", "Prone", "NotSelfPickable"],
							SetPose: ["BackElbowTouch"],
							SelfUnlock: false,
						},
					},
					{
						Name: "Both",
						Property: {
							Type: "Both",
							Difficulty: 6,
							Effect: ["Block", "Prone", "NotSelfPickable"],
							SetPose: ["BackElbowTouch"],
							SelfUnlock: false,
						},
					},
				],
				Dialog: {
					Load: "SelectBondagePosition",
					TypePrefix: "ItemArmsCuffs",
				},
			},
		}, // LeatherCuffs
		OrnateCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LeatherCuffs" },
		}, // OrnateCuffs
		SteelCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LeatherCuffs" },
			Config: {
				Options: [
					{
						Name: "None",
						Property: { Type: null }
					},
					{
						Name: "Wrist",
						Property: {
							Type: "Wrist",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"]
						}
					}
				],
			},
		}, // SteelCuffs	
		StraitJacket: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							Difficulty: 0,
						},
					},
					{
						Name: "Normal",
						Property: {
							Type: "Normal",
							Difficulty: 3,
						},
					},
					{
						Name: "Snug",
						Property: {
							Type: "Snug",
							Difficulty: 6,
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Difficulty: 9,
						},
					},
				],
				Dialog: {
					Load: "ItemArmsStraitJacketSelect",
					TypePrefix: "ItemArmsStraitJacket",
				},
			},
		}, // StraitJacket
		LeatherStraitJacket: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "StraitJacket" },
		}, // LeatherStraitJacket
		CollarCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							Difficulty: 0,
						},
					},
					{
						Name: "Normal",
						Property: {
							Type: "Normal",
							Difficulty: 3,
						},
					},
					{
						Name: "Snug",
						Property: {
							Type: "Snug",
							Difficulty: 6,
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Difficulty: 9,
						},
					},
				],
				DrawImages: false,
			},
		}, // CollarCuffs
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Arms",
						Property: { Type: null, Difficulty: 1 },
					},
					{
						Name: "Bottom",
						SelfBondageLevel: 4,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Bottom",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemVulvaPiercings"],
							Difficulty: 2,
						},
					},
					{
						Name: "Top",
						SelfBondageLevel: 6,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Top",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemTorso", "ItemBreast", "ItemNipples", "ItemNipplesPiercings"],
							Difficulty: 4,
						},
					},
					{
						Name: "Full",
						SelfBondageLevel: 8,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Full",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemVulvaPiercings", "ItemNipplesPiercings"],
							Difficulty: 6,
						}
					},
					{
						Name: "Complete",
						SelfBondageLevel: 10,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Complete",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemVulvaPiercings", "ItemNipplesPiercings"],
							Difficulty: 7,
						}
					},
					{
						Name: "ExposedComplete",
						SelfBondageLevel: 10,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "ExposedComplete",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemVulvaPiercings", "ItemBreast"],
							Difficulty: 7,
						}
					},
					{
						Name: "PetTape",
						SelfBondageLevel: 10,
						Property: {
							Type: "PetTape",
							SetPose: ["BackElbowTouch"],
							Block: ["ItemHands"],
							Difficulty: 7,
						}
					},
				],
				Dialog: {
					Load: "SelectTapeWrapping",
				},
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR, CommonChatTags.DEST_CHAR],
			}
		}, // DuctTape
		Zipties: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "ZipLight",
						Property: {
							Type: null,
							Effect: ["Block", "Prone"],
							SetPose: ["BackElbowTouch"],
							Difficulty: 1
						}
					}, {
						Name: "ZipMedium",
						Property: {
							Type: "ZipMedium",
							Effect: ["Block", "Prone"],
							SetPose: ["BackElbowTouch"],
							Difficulty: 2
						},
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "ZipFull",
						Property: {
							Type: "ZipFull",
							Effect: ["Block", "Prone"],
							SetPose: ["BackElbowTouch"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }]
					}, {
						Name: "ZipElbowWrist",
						Property: {
							Type: "ZipElbowWrist",
							Effect: ["Block", "Prone"],
							SetPose: ["BackElbowTouch"],
							Difficulty: 1
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipWristLight",
						Property: {
							Type: "ZipWristLight",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipWristMedium",
						Property: {
							Type: "ZipWristMedium",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipWristFull",
						Property: {
							Type: "ZipWristFull",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipWrist",
						Property: {
							Type: "ZipWrist",
							Effect: ["Block", "Prone"],
							SetPose: ["BackBoxTie"],
							Difficulty: 1
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }]
					}, {
						Name: "ZipKneelingHogtie",
						Prerequisite: ["NotMounted", "NotSuspended"],
						Property: {
							Type: "ZipKneelingHogtie",
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Kneel", "BackElbowTouch"], Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "ZipHogtie",
						Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
						Property: {
							Type: "ZipHogtied",
							Effect: ["Block", "Freeze", "Prone"],
							Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["Hogtied"], Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					}, {
						Name: "ZipAllFours",
						Prerequisite: ["NotMounted", "NotSuspended", "CannotBeHogtiedWithAlphaHood"],
						Property: {
							Type: "ZipAllFours", Effect: ["ForceKneel"],
							Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"],
							AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"],
							SetPose: ["AllFours"], Difficulty: 3
						},
						Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
						Random: false,
					},
				],
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Dialog: {
					Load: "SelectZipTie",
				}
			},
		}, // Zipties
		ThinLeatherStraps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Wrist", Property: { Type: "Wrist", SetPose: ["BackBoxTie"] } },
					{ Name: "Boxtie", Property: { Type: null, SetPose: ["BackBoxTie"] } },
					{ Name: "WristElbow", Property: { Type: "WristElbow", SetPose: ["BackElbowTouch"] } },
					{ Name: "WristElbowHarness", Property: { Type: "WristElbowHarness", SetPose: ["BackElbowTouch"] } },
					{
						Name: "Hogtie",
						Property: {
							Type: "Hogtie", SetPose: ["Hogtied"], Effect: ["Block", "Freeze", "Prone"]
						},
						Random: false,
					}
				]
			}
		}, //ThinLeatherStraps
		MermaidSuit: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Zipped",
						Property: {
							Type: null,
							Difficulty: 0,
							Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
						},
					},
					{
						Name: "UnZip",
						Property: {
							Type: "UnZip",
							Block: [],
						},
					},
				],
			},
		}, // MermaidSuit
		TightJacket: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Basic",
						Property: {
							Type: null,
							Difficulty: 1,
						},
					},
					{
						Name: "PulledStraps",
						Property: {
							Type: "PulledStraps",
							Difficulty: 1,
						},
					},
					{
						Name: "LiningStraps",
						Property: {
							Type: "LiningStraps",
							Difficulty: 2,
						},
					},
					{
						Name: "ExtraPadding",
						Property: {
							Type: "ExtraPadding",
							Difficulty: 2,
						},
					},
					{
						Name: "PulledLining",
						Property: {
							Type: "PulledLining",
							Difficulty: 3,
						},
					},
					{
						Name: "PulledPadding",
						Property: {
							Type: "PulledPadding",
							Difficulty: 3,
						},
					},
					{
						Name: "PaddedLining",
						Property: {
							Type: "PaddedLining",
							Difficulty: 3,
						},
					},
					{
						Name: "FullJacket",
						Property: {
							Type: "FullJacket",
							Difficulty: 4,
						},
					},
				],
				Dialog: {
					Load: "ItemArmsTightJacketSelect",
					TypePrefix: "ItemArmsTightJacket",
					ChatPrefix: "ItemArmsTightJacketSet",
				},
			},
		}, // TightJacket
		TightJacketCrotch: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "TightJacket" },
		}, // TightJacketCrotch
		WrappedBlanket: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "NormalWrapped",
						Property: { Type: null, },
					},
					{
						Name: "ShouldersWrapped",
						Property: { Type: "ShouldersWrapped", },
					},
					{
						Name: "FeetWrapped",
						Property: { Type: "FeetWrapped", },
					},
					{
						Name: "FullWrapped",
						Property: { Type: "FullWrapped", },
					},
				],
			},
		}, // WrappedBlanket
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Cross",
						Property: { Type: null, Difficulty: 1 },
					},
					{
						Name: "Heavy",
						SelfBondageLevel: 4,
						Property: { Type: "Heavy", Difficulty: 2 }
					},
				],
				Dialog: {
					Load: "SelectRibbonType",
				},
			},
		}, // Ribbons
		SturdyLeatherBelts: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				ChangeWhenLocked: false,
				Dialog: {
					Load: "SturdyLeatherBeltsSelectTightness",
					TypePrefix: "SturdyLeatherBeltsPose",
					ChatPrefix: "SturdyLeatherBeltsRestrain",
				},
				Options: [
					{
						Name: "One",
						Property: { Type: null, },
					},
					{
						Name: "Two",
						Property: { Type: "Two", Difficulty: 2, },
					},
					{
						Name: "Three",
						Property: { Type: "Three", Difficulty: 4, },
					},
				],
			}
		}, // SturdyLeatherBelts
		StraitLeotard: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Cloth", Key: "cl",
						Options: [{ Property: { Hide: ["Cloth"] } }, {}],
					},
					{
						Name: "Corset", Key: "co",
						Options: [{ Property: { Hide: ["Corset", "ItemTorso"] } }, {}],
					},
					{
						Name: "NipplesPiercings", Key: "np",
						Options: [{ Property: { Hide: ["ItemNipplesPiercings", "ItemNipples", "ItemBreast"] } }, {}],
					},
					{
						Name: "VulvaPiercings", Key: "vp",
						Options: [{ Property: { Hide: ["ItemVulvaPiercings", "Panties", "ItemPelvis"] } }, {}],
					},
				],
				ChangeWhenLocked: false,
			},
		}, // StraitLeotard
	}, // ItemArms
	ItemNeck: {
		ShinySteelCollar: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "NoRing", Property: { Type: null } },
					{ Name: "Ring", Property: { Type: "Ring" } }
				],
				DrawImages: false
			}
		} // ShinySteelCollar
	}, // ItemNeck
	ItemHood: {
		InflatedBallHood: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Empty",
						Property: {
							Type: null,
							Difficulty: 0,
							InflateLevel: 0,
							Effect: [],
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							Difficulty: 2,
							InflateLevel: 1,
							Effect: ["GagLight", "BlockMouth"],
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							Difficulty: 4,
							InflateLevel: 2,
							Effect: ["GagEasy", "BlockMouth"],
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							Difficulty: 6,
							InflateLevel: 3,
							Effect: ["GagMedium", "BlockMouth"],
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							Difficulty: 8,
							InflateLevel: 4,
							Effect: ["GagVeryHeavy", "BlockMouth"],
						},
					},
				],
				Dialog: {
					Load: "SelectInflateLevel",
					TypePrefix: "InflateLevel",
					ChatPrefix: ({ newIndex, previousIndex }) => `InflatedHood${(newIndex > previousIndex) ? "pumps" : "deflates"}To`,
				},
				DrawImages: false,
			}
		}, // InflatedBallHood
		KirugumiMask: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				ChatSetting: ModularItemChatSetting.PER_MODULE,
				Modules: [
					{
						Name: "Eyes", Key: "e",
						Options: [{}, {}, {}, {}], // All options are merely cosmetic
					},
					{
						Name: "Mouth", Key: "m",
						Options: [{}, {}, {}, {}], // All options are merely cosmetic,
					},
					{
						Name: "Blush", Key: "b",
						Options: [{}, {}, {}, {}], // All options are merely cosmetic,
					},
					{
						Name: "Brows", Key: "br",
						Options: [{}, {}, {}, {}], // All options are merely cosmetic,
					},
					{
						Name: "Opacity", Key: "op",
						Options: [
							{},
							{
								Property: {
									Effect: ["BlindLight"],
								},
							},
							{
								Property: {
									Effect: ["BlindHeavy", "Prone"],
								},
							}
						], // Opacity
					},
					{
						Name: "MaskStyle", Key: "ms",
						Options: [
							{
								Property: {
									Effect: ["BlockMouth"],
									Hide: ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Mask"],
									HideItem: ["ItemHeadSnorkel"],
									Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose", "ItemEars"]
								}
							},
							{
								Property: {
									OverridePriority: 35,
									Hide: ["Head"],
								}
							},
						],
					},
				],
				ChangeWhenLocked: false,
			},
		}, // KirugumiMask
		GwenHood: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "HairOutAccOut",
						Property: {
							Type: null,
							Hide: []
						},
					},
					{
						Name: "HairInAccOut",
						Property: {
							Type: "HairInAccOut",
							Hide: ["HairBack"]
						},
					},
					{
						Name: "HairOutAccIn",
						Property: {
							Type: "HairOutAccIn",
							Hide: ["HairAccessory1", "HairAccessory2", "HairAccessory3"]
						},
					},
					{
						Name: "HairInAccIn",
						Property: {
							Type: "HairInAccIn",
							Hide: ["HairAccessory1", "HairAccessory2", "HairAccessory3", "HairBack"]
						},
					},
				],
				Dialog: {
					Load: "GwenHoodSelectStyle",
					TypePrefix: "GwenHoodStyle",
					ChatPrefix: "GwenHoodChangeStyle",
				},
				DrawImages: false,
			},
		}, // GwenHood
	}, // ItemHood
	ItemDevices: {
		BondageBench: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "None",
						Property: {
							Type: null,
							Difficulty: 0,
							AllowLock: false,
							SetPose: ["LegsClosed"],
							Effect: ["Mounted"],
						},
					},
					{
						Name: "Light",
						SelfBondageLevel: 2,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Light",
							Difficulty: 2,
							SetPose: ["LegsClosed", "BaseUpper"],
							Effect: ["Block", "Prone", "Freeze", "Mounted"],
							Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
						},
					},
					{
						Name: "Normal",
						SelfBondageLevel: 3,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Normal",
							Difficulty: 3,
							SetPose: ["LegsClosed", "BaseUpper"],
							Effect: ["Block", "Prone", "Freeze", "Mounted"],
							Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
						},
					},
					{
						Name: "Heavy",
						SelfBondageLevel: 6,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Heavy",
							Difficulty: 6,
							SetPose: ["LegsClosed", "BaseUpper"],
							Effect: ["Block", "Prone", "Freeze", "Mounted"],
							Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
						},
					},
					{
						Name: "Full",
						SelfBondageLevel: 9,
						Prerequisite: ["NoOuterClothes"],
						Property: {
							Type: "Full",
							Difficulty: 9,
							SetPose: ["LegsClosed", "BaseUpper"],
							Effect: ["Block", "Prone", "Freeze", "Mounted"],
							Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"],
						},
					},
				],
				Dialog: {
					Load: "BondageBenchStrapsSelectTightness",
					TypePrefix: "BondageBenchStrapsPose",
					ChatPrefix: "BondageBenchStrapsRestrain",
				},
			},
		}, // BondageBench
		Cushion: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Hold",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Kneel",
						Prerequisite: ["NotSuspended", "CanKneel"],
						Property: {
							Type: "Kneel",
							OverrideHeight: { Height: -200, Priority: 21 },
							OverridePriority: 1,
							SetPose: ["Kneel"]
						},
					},
				],
				Dialog: {
					Load: "SelectCushionStyle",
					TypePrefix: "CushionType",
				},
				ChatSetting: TypedItemChatSetting.SILENT,
			},
		}, // Cushion
		Crib: {
			Archetype: ExtendedArchetype.MODULAR,
			Config: {
				Modules: [
					{
						Name: "Gate", Key: "g",
						Options: [
							{}, // g0 - Gate open
							{ Property: { Difficulty: 15 } }, // g1 - Gate closed
						],
					},
					{
						Name: "Plushies", Key: "p",
						Options: [
							{}, // p0 - No plushies
							{}, // p1 - Plushies
						],
					},
				],
			},
		}, // Crib
		TeddyBear: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Bear",
						Property: { Type: null },
					},
					{
						Name: "Fox",
						Property: { Type: "Fox" },
					},
					{
						Name: "Pup",
						Property: { Type: "Pup" },
					},
					{
						Name: "Pony",
						Property: { Type: "Pony" },
					},
					{
						Name: "Kitty",
						Property: { Type: "Kitty" },
					},
					{
						Name: "Bunny",
						Property: { Type: "Bunny" },
					},
				],
			},
		}, // TeddyBear
		PetBed: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "NoBlanket",
						Property: {
							Type: null
						},
					},
					{
						Name: "Blanket",
						Property: {
							Type: "Blanket",
							SetPose: ["AllFours"],
							Hide: ["ItemArms", "ItemButt", "TailStraps", "Wings"],
							Block: [
								"ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemBoots",
								"ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings",
								"ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"
							]
						},
						Random: false,
					},
				],
			},
		}, // PetBed
		Vacbed: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Normal",
						Property: { Type: null }
					},
					{
						Name: "Nohair",
						Property: {
							Type: "Nohair",
							Hide: ["HairFront", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Hat"],
						},
					},
				],
			},
		}, // Vacbed
		Familiar: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Bat",
						Property: { Type: null },
					},
					{
						Name: "Cat",
						Property: { Type: "Cat" },
					},
					{
						Name: "Skeleton",
						Property: { Type: "Skeleton" },
					},
					{
						Name: "Parrot",
						Property: { Type: "Parrot" },
					},
				],
			},
		}, // Familiar
		LittleMonster: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Black",
						Property: { Type: null },
					},
					{
						Name: "Red",
						Property: { Type: "Red" },
					},
					{
						Name: "Green",
						Property: { Type: "Green" },
					},
					{
						Name: "Blue",
						Property: { Type: "Blue" },
					},
				],
			},
		}, // LitteMonster
		InflatableBodyBag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Light",
						Property: {
							Type: null,
							Difficulty: 0,
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							Difficulty: 3,
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							Difficulty: 6,
						},
					},
					{
						Name: "Max",
						Property: {
							Type: "Max",
							Difficulty: 9,
						},
					},
				],
			},
		}, // InflatableBodyBag
		Pole: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Untied",
						Property: {
							Type: null,
						}
					},
					{
						Name: "Tied",
						SelfBondageLevel: 2,
						Property: {
							Type: "Tied",
							Difficulty: 8,
							SetPose: ["BackBoxTie"],
							Effect: ["Block", "Freeze", "Prone"],
						}
					},
				],
			},
		}, // Pole
		CryoCapsule: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
							Difficulty: 0,
							Effect: ["Freeze"],
							SelfUnlock: true
						}
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							Difficulty: 50,
							Effect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"],
							SelfUnlock: false
						}
					}
				],
				ChangeWhenLocked: false,
				Dialog: {
					Load: "SelectCryoCapsuleType",
					TypePrefix: "CryoCapsuleType",
					ChatPrefix: "CryoCapsuleSet",
				},
			},
		}, // CryoCapsule
		Coffin: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "CryoCapsule" },
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
							Difficulty: 0,
							Effect: ["Freeze"],
							SelfUnlock: true
						}
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							Difficulty: 50,
							Effect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"],
							SelfUnlock: false
						}
					}
				],
				Dialog: {
					Load: "SelectCoffinType",
					TypePrefix: "CoffinType",
					ChatPrefix: "CoffinSet",
				},
			},
		}, // Coffin
	}, // ItemDevices
	ItemBoots: {
		ToeTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Toes",
						Property: { Type: null, Difficulty: 0 },
					},
					{
						Name: "Full",
						Property: { Type: "Full", Difficulty: 2 },
					},
				],
				Dialog: {
					Load: "SelectTapeWrapping",
					TypePrefix: "ToeTapePose",
					ChatPrefix: "ToeTapeSet",
					NpcPrefix: "",
				},
			},
		}, // ToeTape
	}, // ItemBoots
	ItemVulva: {
		ClitSuctionCup: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							SuctionLevel: 0,
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							SuctionLevel: 1,
						},
					},
					{
						Name: "Medium",
						Property: {
							Type: "Medium",
							SuctionLevel: 2,
						},
					},
					{
						Name: "Heavy",
						Property: {
							Type: "Heavy",
							SuctionLevel: 3,
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							SuctionLevel: 4,
						},
					},
				],
				Dialog: {
					Load: "SelectSuctionLevel",
					TypePrefix: "SuctionLevel",
					ChatPrefix: ({ newIndex, previousIndex }) => `ClitSuc${(newIndex > previousIndex) ? "tightens" : "loosens"}To`,
					NpcPrefix: "ItemVulvaClitSuctionCupNPCReaction"
				},
				DrawImages: false,
			},
		}, // ClitSuctionCup
	}, // ItemVulva
	ItemVulvaPiercings: {
		ClitRing: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						Property: {
							Type: null,
							Effect: [],
						},
					},
					{
						Name: "Leash",
						Prerequisite: ["NotSuspended"],
						Property: {
							Type: "Leash",
							Effect: ["Leash"],
						},
					},
				],
				Dialog: {
					Load: "SelectAttachmentState",
					TypePrefix: "ClitRingPose",
					ChatPrefix: "ClitRingRestrain",
				},
			},
		}, // ClitRing
	}, // ItemVulvaPiercings
	ItemButt: {
		AnalHook: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						Property: {
							Type: null,
							Difficulty: 0,
							Intensity: 0,
							Effect: ["IsPlugged"],
						},
					},
					{
						Name: "Chain",
						Property: {
							Type: "Chain",
							Difficulty: 8,
							Intensity: 1,
							Effect: ["IsPlugged", "Freeze", "Egged"]
						},
						Random: false,
					},
					{
						Name: "Hair",
						Property: {
							Type: "Hair",
							Difficulty: 4,
							Intensity: 1,
							Effect: ["IsPlugged", "Egged"]
						}
					},
				],
				Dialog: {
					Load: "SelectAttachmentState",
					TypePrefix: "AnalHookPose",
					ChatPrefix: "AnalHookRestrain",
					NpcPrefix: "InventoryItemButtAnalHookNPCReaction",
				},
			},
		}, // AnalHook
		ButtPlugLock: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						Property: { Type: null },
					},
					{
						Name: "ChainShort",
						Prerequisite: ["NotSuspended", "CanKneel", "NotMounted"],
						Property: {
							Type: "ChainShort",
							Effect: ["Freeze", "ForceKneel", "IsChained"],
							SetPose: ["Kneel"],
						},
						Random: false,
					},
					{
						Name: "ChainLong",
						Prerequisite: ["NotSuspended"],
						Property: {
							Type: "ChainLong",
							Effect: ["Tethered", "IsChained"],
						},
						Random: false,
					},
				],
				Dialog: {
					Load: "SelectAttachmentState",
					TypePrefix: "ButtPlugLockPose",
					ChatPrefix: "ButtPlugLockRestrain",
					NpcPrefix: "ButtPlugLockSet",
				},
			},
		}, // ButtPlugLock
		ButtPump: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Empty",
						Property: {
							Type: null,
							InflateLevel: 0,
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							InflateLevel: 1,
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							InflateLevel: 2,
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							InflateLevel: 3,
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							InflateLevel: 4,
						},
					},
				],
				Dialog: {
					Load: "SelectInflateLevel",
					TypePrefix: "InflateLevel",
					ChatPrefix: ({ newIndex, previousIndex }) => `BPumps${(newIndex > previousIndex) ? "pumps" : "deflates"}To`,
					NpcPrefix: "InventoryItemButtButtPumpNPCReaction",
				},
				DrawImages: false,
			},
		}, // ButtPump
	}, // ItemButt
	ItemNipplesPiercings: {
		RoundPiercing: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						BondageLevel: 0,
						Prerequisite: ["AccessBreast", "AccessBreastSuitZip"],
						Property: {
							Type: null,
							Difficulty: 0,
						},
					},
					{
						Name: "Chain",
						BondageLevel: 0,
						Prerequisite: ["AccessBreast", "AccessBreastSuitZip", "Collared"],
						Property: {
							Type: "Chain",
							Difficulty: 0,
							Block: ["ItemNeck"],
						},
					},
					{
						Name: "Weighted",
						BondageLevel: 0,
						Prerequisite: ["AccessBreast", "AccessBreastSuitZip"],
						Property: {
							Type: "Weighted",
							Difficulty: 0,
						},
					},
					{
						Name: "WeightedChain",
						BondageLevel: 0,
						Prerequisite: ["AccessBreast", "AccessBreastSuitZip", "Collared"],
						Property: {
							Type: "WeightedChain",
							Difficulty: 0,
							Block: ["ItemNeck"],
						},
					},
				],
				Dialog: {
					Load: "SelectPiercingState",
					TypePrefix: "RoundPiercingPose",
					ChatPrefix: "RoundPiercingRestrain",
					NpcPrefix: "RoundPiercingNPCReaction",
				},
			},
		}, // RoundPiercing
	}, // ItemNipplesPiercings
	ItemNipples: {
		LactationPump: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Off",
						Property: {
							Type: null,
							SuctionLevel: 0,
						},
					},
					{
						Name: "LowSuction",
						Property: {
							Type: "LowSuction",
							SuctionLevel: 1,
						},
					},
					{
						Name: "MediumSuction",
						Property: {
							Type: "MediumSuction",
							SuctionLevel: 2,
						},
					},
					{
						Name: "HighSuction",
						Property: {
							Type: "HighSuction",
							SuctionLevel: 3,
						},
					},
					{
						Name: "MaximumSuction",
						Property: {
							Type: "MaximumSuction",
							SuctionLevel: 4,
						},
					},
				],
				Dialog: {
					Load: "LactationPumpSelectSetting",
					TypePrefix: "LactationPump",
					ChatPrefix: ({ newIndex, previousIndex }) => `LactationPumpPower${(newIndex > previousIndex) ? "tightens" : "loosens"}To`,
				},
				DrawImages: false,
			},
		}, // LactationPump
		NippleSuctionCups: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null,
							SuctionLevel: 0,
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							SuctionLevel: 1,
						},
					},
					{
						Name: "Medium",
						Property: {
							Type: "Medium",
							SuctionLevel: 2,
						},
					},
					{
						Name: "Heavy",
						Property: {
							Type: "Heavy",
							SuctionLevel: 3,
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							SuctionLevel: 4,
						},
					},
				],
				Dialog: {
					Load: "SelectSuctionLevel",
					TypePrefix: "SuctionLevel",
					ChatPrefix: ({ newIndex, previousIndex }) => `NipSuc${(newIndex > previousIndex) ? "tightens" : "loosens"}To`,
				},
				DrawImages: false,
			},
		}, // NippleSuctionCups
		PlateClamps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Loose",
						Property: {
							Type: null
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight"
						},
					}
				],
				Dialog: {
					Load: "ItemNipplesPlateClampsSelectTightness",
					TypePrefix: "ItemNipplesPlateClampsTightnessLevel",
					ChatPrefix: "ItemNipplesPlateClamps",
				},
				DrawImages: false,
			},
		}, // PlateClamps
	}, // ItemNipples
	Corset: {
		LatexCorset1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Garter",
						Property: { Type: null },
					},
					{
						Name: "NoGarter",
						Property: { Type: "Garterless" },
					},
				],
				Dialog: {
					Load: "LatexCorset1Select",
					TypePrefix: "LatexCorset1",
					ChatPrefix: "LatexCorset1Set",
				},
			},
		}, // LatexCorset1
	}, // Corset
	ItemTorso: {
		HeavyLatexCorset: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Normal",
						Property: { Type: null },
					},
					{
						Name: "Straps",
						Property: { Type: "Straps" },
					},
				],
				Dialog: {
					Load: "SelectHeavyLatexCorsetType",
					TypePrefix: "HeavyLatexCorsetType",
					ChatPrefix: "HeavyLatexCorsetSet",
					NpcPrefix: "HeavyLatexCorset",
				},
			}
		}, // HeavyLatexCorset
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Basic",
						Property: { Type: null, Difficulty: 1 }
					}, {
						Name: "Harness1",
						BondageLevel: 2,
						Property: { Type: "Harness1" , Difficulty: 3 , Effect: ["CrotchRope"]}
					}, {
						Name: "Harness2",
						BondageLevel: 3,
						Property: { Type: "Harness2" , Difficulty: 4, Effect: ["CrotchRope"] }
					}
				],
				Dialog: {
					Load: "SelectRibbonType",
					TypePrefix: "RibbonsTorso",
					ChatPrefix: "TorsoRibbonsSet",
					NpcPrefix: "ItemTorsoRibbons",
				},
			}
		}, // Ribbons
		LatexCorset1: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "Corset", AssetName: "LatexCorset1" },
		}, //LatexCorset1
		SilkStraps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Crotch", Property: { Type: null } },
					{ Name: "Waist", Property: { Type: "Waist" } },
					{ Name: "Harness", Property: { Type: "Harness" } },
					{ Name: "Star", Property: { Type: "Star" } },
					{ Name: "Diamond", Property: { Type: "Diamond" } },
				]
			},
		}, // SilkStraps
		ThinLeatherStraps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Crotch", Property: { Type: null } },
					{ Name: "Waist", Property: { Type: "Waist" } },
					{ Name: "Harness", Property: { Type: "Harness" } },
				]
			},
		}, // ThinLeatherStraps
		NylonRopeHarness: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "HempRopeHarness" }
		}, // NylonRopeHarness
		HempRopeHarness: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Crotch",
						Property: { Type: null, Difficulty: 1, Effect: ["CrotchRope"] }
					}, {
						Name: "Waist",
						Property: { Type: "Waist", Difficulty: 1 }
					}, {
						Name: "Harness",
						BondageLevel: 2,
						Property: { Type: "Harness", Difficulty: 1, Effect: ["CrotchRope"] }
					}, {
						Name: "Star",
						BondageLevel: 3,
						Property: { Type: "Star", Difficulty: 2 }
					}, {
						Name: "Diamond",
						BondageLevel: 4,
						Property: { Type: "Diamond", Difficulty: 3, Effect: ["CrotchRope"] }
					},
				],
				Dialog: {
					Load: "SelectRopeBondage",
					TypePrefix: "RopeBondage",
					ChatPrefix: "RopeHarnessSet",
					NpcPrefix: "RopeBondage",
				},
			},
		}, // HempRopeHarness
	}, // ItemTorso
	Shoes: {
		FuturisticHeels2: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Shiny", Property: { Type: null } },
					{ Name: "Matte", Property: { Type: "Matte" } },
				]
			},
		}, // Shoes
	}, // ItemTorso
	HairAccessory1: {
		ElfEars: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "InFront",
						Property: { Type: null },
					},
					{
						Name: "Behind",
						Property: { Type: "Behind", OverridePriority: 51 },
					},
				],
				Dialog: {
					Load: "HairAccessory1ElfEarsSelect",
					TypePrefix: "HairAccessory1ElfEars",
				},
			}
		} // ElfEars
	}, // HairAccessory1
	HairAccessory2: {
		ElfEars: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "HairAccessory1", AssetName: "ElfEars" },
		},
	}, // HairAccessory2
	ItemMouth: {
		ClothGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Small",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagVeryLight"],
						},
					},
					{
						Name: "Cleave",
						Property: {
							Type: "Cleave",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
					{
						Name: "OTM",
						Property: {
							Type: "OTM",
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "OTN",
						Property: {
							Type: "OTN",
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
				],
				Dialog: {
					Load: "SelectGagType",
					TypePrefix: "ClothGagType",
					ChatPrefix: "ClothGagSet",
				},
			},
		}, // ClothGag
		WiffleGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagNormal"],
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Effect: ["BlockMouth", "GagNormal"],
						},
					},
				],
				Dialog: {
					Load: "SelectGagType",
					TypePrefix: "BallGagMouthType",
					ChatPrefix: "BallGagMouthSet",
				},
			},
		}, // WiffleGag
		BallGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
					{
						Name: "Shiny",
						Property: {
							Type: "Shiny",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
					{
						Name: "Tight",
						Property: {
							Type: "Tight",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
				],
				Dialog: {
					Load: "SelectGagType",
					TypePrefix: "BallGagMouthType",
					ChatPrefix: "BallGagMouthSet",
				},
			},
		}, // BallGag
		HarnessBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "BallGag" },
		},
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Small",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagVeryLight"],
						},
					},
					{
						Name: "Crossed",
						Property: {
							Type: "Crossed",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
					{
						Name: "Full",
						Property: {
							Type: "Full",
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Double",
						Property: {
							Type: "Double",
							Effect: ["BlockMouth", "GagNormal"],
						},
					},
					{
						Name: "Cover",
						Property: {
							Type: "Cover",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
				],
				Dialog: {
					Load: "SelectGagType",
					TypePrefix: "DuctTapeMouthType",
					ChatPrefix: "DuctTapeMouthSet",
				},
			},
		}, // DuctTape
		CupholderGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "NoCup",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Tip",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Cup",
						Property: {
							Type: "Cup",
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
				],
				Dialog: {
					Load: "CupholderGagOptions",
					TypePrefix: "CupholderGagOptions",
					ChatPrefix: "CupholderGagSet",
				},
				DrawImages: false,
			},
		}, // CupholderGag
		PumpGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Empty",
						Property: {
							Type: null,
							InflateLevel: 0,
							Difficulty: 0,
							Effect: ["BlockMouth"],
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							InflateLevel: 1,
							Difficulty: 2,
							Effect: ["BlockMouth", "GagLight"],
						},
					},
					{
						Name: "Inflated",
						Property: {
							Type: "Inflated",
							InflateLevel: 2,
							Difficulty: 4,
							Effect: ["BlockMouth", "GagEasy"],
						},
					},
					{
						Name: "Bloated",
						Property: {
							Type: "Bloated",
							InflateLevel: 3,
							Difficulty: 6,
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
					{
						Name: "Maximum",
						Property: {
							Type: "Maximum",
							InflateLevel: 4,
							Difficulty: 8,
							Effect: ["BlockMouth", "GagVeryHeavy"],
						},
					},
				],
				Dialog: {
					Load: "SelectInflateLevel",
					TypePrefix: "InflateLevel",
					ChatPrefix: ({ previousIndex, newIndex }) =>
						`PumpGag${newIndex > previousIndex ? "pumps" : "deflates"}To`,
				},
				DrawImages: false,
			},
		}, // PumpGag
		PlugGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
							Effect: ["GagMedium", "OpenMouth"],
						},
					},
					{
						Name: "Plug",
						Property: {
							Type: "Plug",
							Effect: ["BlockMouth", "GagTotal"],
						},
					},
				],
				Dialog: {
					Load: "SelectGagType",
					TypePrefix: "PlugGagMouthType",
					ChatPrefix: "PlugGagMouthSet",
				},
			},
		}, // PlugGag
		DildoPlugGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
							Effect: ["GagEasy", "OpenMouth"],
						},
					},
					{
						Name: "Plug",
						Property: {
							Type: "Plug",
							Effect: ["BlockMouth", "GagTotal2"],
						},
					},
				],
				Dialog: {
					Load: "SelectGagType",
					TypePrefix: "PlugGagMouthType",
					ChatPrefix: "DildoPlugGagMouthSet",
				},
			},
		}, // DildoPlugGag
		MilkBottle: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Rest",
						Property: { Type: null },
					},
					{
						Name: "Raised",
						Property: { Type: "Raised" },
					},
					{
						Name: "Chug",
						Property: { Type: "Chug" },
					},
				],
				Dialog: {
					Load: "SelectMilkBottleState",
					TypePrefix: "MilkBottle",
					ChatPrefix: "MilkBottleSet",
				},
			},
		}, // MilkBottle
		FunnelGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: {
							Type: null,
							Effect: ["GagMedium", "OpenMouth"],
						},
					},
					{
						Name: "Funnel",
						Property: {
							Type: "Funnel",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
				],
				Dialog: {
					Load: "SelectGagType",
					TypePrefix: "FunnelGagMouthType",
					ChatPrefix: "FunnelGagMouthSet",
				},
			},
		}, // FunnelGag
		HarnessPonyBits: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Detached",
						Property: {
							Type: "Detached",
							Effect: ["OpenMouth"]
						},
					},
					{
						Name: "Attached",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagLight"]
						},
					},
				],
			},
		}, // PonyBit
		DentalGag: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null,
							Effect: ["OpenMouth", "GagLight"],
						},
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							Effect: ["BlockMouth", "GagMedium"],
						},
					},
				],
				ChangeWhenLocked: false,
			},
		}, // DentalGag
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Basic",
						Property: {
							Type: null,
							Effect: ["BlockMouth", "GagVeryLight"],
						},
					},
					{
						Name: "Bow",
						Property: {
							Type: "Bow",
							Effect: ["BlockMouth", "GagLight"],
						},
					},
				],
				Dialog: {
					Load: "SelectRibbonType",
					TypePrefix: "RibbonType",
					ChatPrefix: "RibbonsGagSet",
				},
			},
		}, // Ribbons
	}, // ItemMouth
	ItemMouth2: {
		ClothGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "ClothGag" },
		},
		WiffleGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "WiffleGag" },
		},
		BallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "BallGag" },
		},
		HarnessBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "BallGag" },
		},
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "DuctTape" },
		},
		CupholderGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "CupholderGag" },
		},
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "Ribbons" },
		},
	}, // ItemMouth2
	ItemMouth3: {
		ClothGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "ClothGag" },
		},
		WiffleGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "WiffleGag" },
		},
		BallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "BallGag" },
		},
		HarnessBallGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "BallGag" },
		},
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "DuctTape" },
		},
		CupholderGag: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "CupholderGag" },
		},
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemMouth", AssetName: "Ribbons" },
		},
	}, // ItemMouth3
	Mask: {
		BunnyMask1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Ears",
						Property: { Type: null },
					},
					{
						Name: "Earless",
						Property: { Type: "Earless", OverridePriority: 51 },
					},
				],
				Dialog: {
					Load: "SelectBunnyMaskStyle",
					TypePrefix: "BunnyMaskType",
				},
			}
		} // BunnyMask1
	}, // Mask
	ItemLegs: {
		HempRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Basic",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 }
					}, {
						Name: "FullBinding",
						BondageLevel: 2,
						Property: { Type: "FullBinding", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "Link",
						BondageLevel: 2,
						Property: { Type: "Link", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "Frogtie",
						BondageLevel: 3,
						Property: { Type: "Frogtie", SetPose: ["Kneel"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
						Prerequisite: ["NotSuspended", "CanKneel"],
						Random: false,
					}, {
						Name: "Crossed",
						BondageLevel: 4,
						Property: { Type: "Crossed", SetPose: ["LegsClosed"], Difficulty: 4 }
					}, {
						Name: "Mermaid",
						BondageLevel: 4,
						Property: { Type: "Mermaid", SetPose: ["LegsClosed"], Difficulty: 4 }
					}					
				],
				Dialog: {
					Load: "SelectRopeBondage",
					TypePrefix: "RopeBondage",
					ChatPrefix: "LegRopeSet",
					NpcPrefix: "RopeBondage",
				},
			}
		}, // HempRope
		Chains: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Basic",
						BondageLevel: 0,
						Property: { Type: null, Difficulty: 0 }
					}, {
						Name: "Strict",
						BondageLevel: 2,
						Property: { Type: "Strict", Difficulty: 2 }
					}					
				],
				Dialog: {
					Load: "SelectChainBondage",
					TypePrefix: "ChainBondage",
					ChatPrefix: "LegChainSet",
					NpcPrefix: "ChainBondage",
				},
				ChangeWhenLocked: false,
			}
		}, // Chains
		SturdyLeatherBelts: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemArms", AssetName: "SturdyLeatherBelts" },
			Config: {
				Options: [
					{
						Name: "One",
						Property: { Type: null, },
					},
					{
						Name: "Two",
						Property: { Type: "Two", Difficulty: 2, },
					},
				],
			}
		}, // SturdyLeatherBelts
		LeatherLegCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "None",
						Property: { Type: null },
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed",
							SetPose: ["LegsClosed"],
							Effect: ["Prone", "KneelFreeze", "Slow"],
							FreezeActivePose: ["BodyLower"],
							Difficulty: 6,
						},
					},
				],
				Dialog: {
					Load: "SelectBondagePosition",
				}
			}
		}, // LeatherLegCuffs
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Messystyle",
						Property: { Type: null, Difficulty: 3 },
					},
					{
						Name: "MessyWrap",
						Property: { Type: "MessyWrap", Difficulty: 4 },
					},
					{
						Name: "Cross",
						Property: { Type: "Cross", Difficulty: 5 },
					},
				],
				Dialog: {
					Load: "SelectRibbonType",
				}
			}
		}, // Ribbons
		OrnateLegCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "LeatherLegCuffs" },
		}, // OrnateLegCuffs
		Zipties: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "ZipLegLight",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 }
					}, {
						Name: "ZipLegMedium",
						Property: { Type: "ZipLegMedium", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "ZipLegFull",
						Property: { Type: "ZipLegFull", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "ZipFrogtie",
						Property: { Type: "ZipFrogtie", SetPose: ["Kneel"], Block: ["ItemFeet"], Effect: ["ForceKneel"], Difficulty: 3 },
						Prerequisite: ["NotSuspended", "CanKneel"],
						Random: false,
					}
				],
				Dialog: {
					Load: "SelectZipTie",
					TypePrefix: "ZipBondage",
					NpcPrefix: "Zip",
				}
			}
		}, // Zipties
	}, // ItemLegs
	ItemFeet: {
		SpreaderMetal: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Narrow",
						Property: {
							Type: null, Effect: ["Prone", "Freeze"], SetPose: ["LegsOpen"],
						}
					},
					{
						Name: "Wide",
						Property: {
							Type: "Wide", Effect: ["Prone", "Freeze"], SetPose: ["Spread"],
						}
					}
				],
				Dialog: {
					Load: "SelectSpreaderType",
					TypePrefix: "SpreaderMetalPose",
				},
				ChatSetting: TypedItemChatSetting.SILENT,
			}
		}, // SpreaderMetal
		Chains: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Basic",
						BondageLevel: 0,
						Property: { Type: null, Difficulty: 0, SetPose: ["LegsClosed"] },
					},
					{
						Name: "Strict",
						BondageLevel: 2,
						Property: { Type: "Strict", Difficulty: 2, SetPose: ["LegsClosed"] },
					},
					{
						Name: "Suspension",
						BondageLevel: 6,
						Prerequisite: ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"],
						Property: {
							Type: "Suspension",
							Difficulty: 4,
							SetPose: ["Suspension", "LegsClosed"],
							AllowActivePose: [],
						},
						Random: false,
					},
				],
				Dialog: {
					Load: "SelectChainBondage",
					TypePrefix: "ChainBondage",
					ChatPrefix: "LegChainSet",
					NpcPrefix: "ChainBondage",
				},
				ChangeWhenLocked: false,
			}
		}, // Chains
		SteelAnkleCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "None",
						Property: {
							Type: null, SetPose: null, Difficulty: null, Effect: null, FreezeActivePose: [],
						}
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed", Effect: ["Prone", "Freeze"], SetPose: ["LegsClosed"], Difficulty: 6, FreezeActivePose: ["BodyLower"],
						}
					}
				],
				Dialog: {
					Load: "SelectBondagePosition",
					TypePrefix: "ItemFeetSteelAnkleCuffs",
					ChatPrefix: "ItemFeetSteelAnkleCuffsSet",
				}
			}
		}, // SteelAnkleCuffs
		SturdyLeatherBelts: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { GroupName: "ItemArms", AssetName: "SturdyLeatherBelts" },
		}, // SturdyLeatherBelts 
		LeatherAnkleCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "SteelAnkleCuffs" },
		}, // LeatherAnkleCuffs
		OrnateAnkleCuffs: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "SteelAnkleCuffs" },
		}, // OrnateAnkleCuffs
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Feet",
						Property: {
							Type: null,
							Difficulty: 0,
							Hide: null,
							SetPose: ["LegsClosed"],
						},
					},
					{
						Name: "HalfFeet",
						Property: {
							Type: "HalfFeet",
							Difficulty: 2,
							Hide: ["ClothLower", "Shoes"],
							SetPose: ["LegsClosed"],
						},
					},
					{
						Name: "MostFeet",
						Property: {
							Type: "MostFeet",
							Difficulty: 4,
							Hide: ["ClothLower", "Shoes"],
							SetPose: ["LegsClosed"],
						},
					},
					{
						Name: "CompleteFeet",
						Property: {
							Type: "CompleteFeet",
							Difficulty: 6,
							Hide: ["ClothLower", "Shoes"],
							SetPose: ["LegsClosed"],
						},
					},
				],
				Dialog: {
					Load: "SelectTapeWrapping",
					ChatPrefix: "DuctTapeRestrain",
					NpcPrefix: "DuctTapeRestrain",
					TypePrefix: "DuctTapePose",
				}
			},
		}, // DuctTape
		Zipties: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "ZipFeetLight",
						Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 },
					}, {
						Name: "ZipFeetMedium",
						Property: { Type: "ZipFeetMedium", SetPose: ["LegsClosed"], Difficulty: 2 }
					}, {
						Name: "ZipFeetFull",
						Property: { Type: "ZipFeetFull", SetPose: ["LegsClosed"], Difficulty: 2 }
					}
				],
				Dialog: {
					Load: "SelectZipTie",
					ChatPrefix: "ZipFeetSet",
					NpcPrefix: "ZipFeetSet",
					TypePrefix: "ZipBondage",
				}
			},
		}, // Zipties
	}, // ItemFeet
	ItemMisc: {
		ServingTray: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Empty", Property: { Type: null } },
					{ Name: "Drinks", Property: { Type: "Drinks" } },
					{ Name: "Cake", Property: { Type: "Cake" } },
					{ Name: "Cookies", Property: { Type: "Cookies" } },
					{ Name: "Toys", Property: { Type: "Toys" } },
				],
			},
		}, // WoodenMaidTray
	}, // ItemMisc
	ItemPelvis: {
		SilkStraps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Crotch", Property: { Type: null } },
					{ Name: "OverPanties", Property: { Type: "OverPanties", OverridePriority: 21 } },
					{ Name: "SwissSeat", Property: { Type: "SwissSeat" } },
					{ Name: "KikkouHip", Property: { Type: "KikkouHip" } },
				]
			},
		}, // SilkStraps
		MetalChastityBelt: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "OpenBack",
						Property: {
							Type: null,
							Block: null,
						},
					},
					{
						Name: "ClosedBack",
						Property: {
							Type: "ClosedBack",
							Block: ["ItemButt"],
						},
					},
				],
				Dialog: {
					Load: "SelectBackShield",
					TypePrefix: "Chastity",
					NpcPrefix: "Chastity",
					ChatPrefix: "ChastityBeltBackShield",
				},
				ChangeWhenLocked: false,
			},
		}, // MetalChastityBelt
		OrnateChastityBelt: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "MetalChastityBelt" },
		}, // OrnateChastityBelt
		StuddedChastityBelt: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "MetalChastityBelt" },
		}, // StuddedChastityBelt
		PolishedChastityBelt: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "MetalChastityBelt" },
		}, // PolishedChastityBelt
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "BowWrap",
						Property: { Type: null, Difficulty: 3, OverridePriority: 21 },
					},
					{
						Name: "CrotchWrapping",
						Property: { Type: "CrotchWrapping", Difficulty: 4 },
					},
				],
				Dialog: {
					Load: "SelectRibbonType",
					TypePrefix: "RibbonsBelt",
					NpcPrefix: "ItemPelvisRibbons",
					ChatPrefix: "PelvisRibbonsSet",
				}
			},
		}, // Ribbons
		HempRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Crotch",
						Property: { Type: null, Difficulty: 1, Effect: ["CrotchRope"] }
					}, {
						Name: "OverPanties",
						Property: { Type: "OverPanties", Difficulty: 1, OverridePriority: 21, Effect: ["CrotchRope"] }
					}, {
						Name: "SwissSeat",
						BondageLevel: 4,
						Property: { Type: "SwissSeat", Difficulty: 4 }
					}, {
						Name: "KikkouHip",
						BondageLevel: 5,
						Property: { Type: "KikkouHip", Difficulty: 5 }
					}
				],
				Dialog: {
					Load: "SelectRopeBondage",
					TypePrefix: "RopeBondage",
					NpcPrefix: "RopeBondage",
					ChatPrefix: "PelvisRopeSet",
				}
			},
		}, // HempRope
	}, // ItemPelvis
	ItemEars: {
		HeadphoneEarPlugs: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR, CommonChatTags.ASSET_NAME],
				Options: [
					{
						Name: "Off",
						Property: {
							Type: null,
							Effect: [],
						},
					},
					{
						Name: "Light",
						Property: {
							Type: "Light",
							Effect: ["DeafLight"],
						},
					},
					{
						Name: "Heavy",
						Property: {
							Type: "Heavy",
							Effect: ["DeafHeavy"],
						},
					},
					{
						Name: "NoiseCancelling",
						Property: {
							Type: "NoiseCancelling",
							Effect: ["DeafTotal"],
						},
					},
				],
				Dialog: {
					Load: "HeadphoneEarPlugsSelectLoudness",
					TypePrefix: "HeadphoneEarPlugsPose",
					ChatPrefix: "HeadphoneEarPlugsRestrain",
					NpcPrefix: "ItemEarsHeadphonePlugs",
				}
			},
		}, // HeadphoneEarPlugs
		Headphones: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "HeadphoneEarPlugs" },
		}, // Headphones
		BluetoothEarbuds: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "HeadphoneEarPlugs" },
		}, // BluetoothEarbuds
	}, // ItemEars
	Bra: {
		SilkStraps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Strip", Property: { Type: null } },
					{ Name: "Wrap", Property: { Type: "Wrap" } },
					{ Name: "Bra1", Property: { Type: "Bra1" } },
					{ Name: "Bra2", Property: { Type: "Bra2" } },
					{ Name: "Swimsuit", Property: { Type: "Swimsuit" } },
				]
			}
		}, // SilkStraps
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Basic",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Bow",
						Property: {
							Type: "Bow",
						},
					},
					{
						Name: "Wrap",
						Property: {
							Type: "Wrap",
						},
					},
				],
				Dialog: {
					TypePrefix: "RibbonBraType",
					Load: "SelectRibbonStyle",
				}
			}
		}, // Ribbons
		SexyBikini1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Open",
						Property: {
							Type: null, 
						},
					},
					{
						Name: "Closed",
						Property: {
							Type: "Closed"
						},
					},
				],
				Dialog: {
					TypePrefix: "BikiniType",
					Load: "SelectBikiniType",
				}
			}
		}, // SexyBikini1
		CuteBikini1: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "SexyBikini1" },
		}, // CuteBikini1
		Swimsuit1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Shiny",
						Property: { Type: null},
					},
					{
						Name: "Dull",
						Property: { Type: "Dull"},
					},
				],		
			},
		}, // ChineseDress2
	}, // Bra
	Panties: {
		SilkStraps: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{ Name: "Strips", Property: { Type: null } },
					{ Name: "Wrap", Property: { Type: "Wrap" } },
					{ Name: "Thong", Property: { Type: "Thong" } },
					{ Name: "Panties1", Property: { Type: "Panties1" } },
				]
			},
		}, // SilkStraps
		Diapers4: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "None",
						Property: { Type: null, },
					},
					{
						Name: "StrawBerry",
						Property: { Type: "StrawBerry", },
					},
					{
						Name: "Flower",
						Property: { Type: "Flower", },
					},
					{
						Name: "Butterflies",
						Property: { Type: "Butterfly", },
					},
					{
						Name: "Spots",
						Property: { Type: "Spots", },
					},
				],
			},
		}, // Diapers4
	}, // Panties
	Glasses: {
		EyePatch1: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Left",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Right",
						Property: {
							Type: "Right",
						},
					},
				],
				Dialog: {
					Load: "SelectEyePatchType",
					TypePrefix: "EyePatchType",
				}
			},
		}, // EyePatch1
	}, // Glasses
	Garters: {
		GarterBelt: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Both",
						Property: {
							Type: null,
						},
					},
					{
						Name: "Right",
						Property: {
							Type: "Right",
						},
					},
					{
						Name: "Left",
						Property: {
							Type: "Left",
						},
					},
				],
				DrawImages: false,
			},
		}, // GarterBelt
	}, // Garters
	Necklace: {
		NecklaceKey: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Normal",
						Property: {
							Type: null,
							OverridePriority: 31
						},
					},
					{
						Name: "Tucked",
						Property: {
							Type: "Tucked",
							OverridePriority: 29
						},
					},
				],
				Dialog: {
					Load: "SelectPriorityType",
					TypePrefix: "ClothPriorityType",
				}
			},
		}, // NecklaceKey
		NecklaceLock: {
			Archetype: ExtendedArchetype.TYPED,
			CopyConfig: { AssetName: "NecklaceKey" },
		}, // NecklaceLock
	}, // Necklace
	ItemHead: {
		DuctTape: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Double",
						Property: {
							Type: null,
							Block: ["ItemNose"],
							Effect: ["BlindNormal", "Prone"],
						},
					},
					{
						Name: "Wrap",
						Property: {
							Type: "Wrap",
							Block: ["ItemNose"],
							Effect: ["BlindNormal", "Prone"],
						},
					},
					{
						Name: "Mummy",
						Property: {
							Type: "Mummy",
							Hide: ["ItemMouth", "ItemMouth2", "ItemMouth3", "HairFront", "HairBack"],
							Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood", "ItemNose"],
							Effect: ["GagNormal", "BlindNormal", "Prone", "BlockMouth"],
						},
					}
				]
			}
		}, // DuctTape
		Ribbons: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Basic",
						Property: {
							Type: null,
							Effect: ["BlindLight", "Prone"],
						},
					},
					{
						Name: "Wrap",
						Property: {
							Type: "Wrap",
							Effect: ["BlindNormal", "Prone"],
						},
					},
				],
				Dialog: {
					Load: "SelectRibbonType",
				},
			},
		}, // Ribbons
		WebBlindfold: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				Options: [
					{
						Name: "Blindfold",
						Property: {
							Type: null,
							Difficulty: 0,
							Block: ["ItemNose"],
						},
					},
					{
						Name: "Cocoon",
						Property: {
							Type: "Cocoon",
							Difficulty: 30,
							Hide: ["HairFront", "HairBack", "Glasses", "Hat", "ItemMouth", "ItemMouth2", "ItemMouth3"],
							Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood", "ItemNose"],
							Effect: ["BlindHeavy", "Prone", "GagNormal", "BlockMouth"],
						},
					},
				],
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Dialog: {
					Load: "WebBondageSelect",
				},
			},
		}, // WebBlindfold
	}, // ItemHead
	ItemAddon: {
		CeilingChain: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Lowered",
						Property: { Type: null, Difficulty: 6, Effect: []}
					}, {
						Name: "Suspended",
							Property: { 
							Type: "Suspended", Difficulty: 7,
							OverrideHeight: { Height: 30, Priority: 51, HeightRatioProportion: 0 },
							Effect: ["Lifted"],
						},
					},
				],
				Dialog: {
					Load: "SelectCeilingChainState",
					TypePrefix: "CeilingChainBondage",
					ChatPrefix: "CeilingChainSet",
					NpcPrefix: "CeilingChain",
				},
			}
		}, // CeilingChain
		CeilingRope: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.TARGET_CHAR],
				Options: [
					{
						Name: "Lowered",
						Property: { Type: null, Difficulty: 6}
					}, {
						Name: "Suspended",
						Property: { 
							Type: "Suspended", Difficulty: 7,
							OverrideHeight: { Height: 30, Priority: 51, HeightRatioProportion: 0 },
							Effect: ["Lifted"],
						},
					},
				],
				Dialog: {
					Load: "SelectCeilingRopeState",
					TypePrefix: "CeilingRopeBondage",
					ChatPrefix: "CeilingRopeSet",
					NpcPrefix: "CeilingRope",
				},
			}
		}, // CeilingRope
	}, // ItemAddon
	ItemNose: {
		NoseRing: {
			Archetype: ExtendedArchetype.TYPED,
			Config: {
				ChatTags: [CommonChatTags.SOURCE_CHAR, CommonChatTags.DEST_CHAR],
				Options: [
					{
						Name: "Base",
						Property: {
							Type: null,
							Effect: [],
							SetPose: [],
						},
					},
					{
						Name: "ChainShort",
						Prerequisite: ["NotSuspended", "CanKneel", "NotMounted"],
						Property: {
							Type: "ChainShort",
							Effect: ["Freeze", "ForceKneel", "IsChained"],
							SetPose: ["Kneel"],
						},
					},
					{
						Name: "ChainLong",
						Prerequisite: ["NotSuspended"],
						Property: {
							Type: "ChainLong",
							Effect: ["Tethered", "IsChained"],
							SetPose: [],
						},
					},
					{
						Name: "Leash",
						Prerequisite: ["NotSuspended"],
						Property: {
							Type: "Leash",
							Effect: ["Leash"],
							SetPose: [],
						},
					},
				],
				Dialog: {
					Load: "SelectAttachmentState",
					TypePrefix: "NoseRingPose",
					ChatPrefix: "NoseRingRestrain",
					NpcPrefix: "InventoryItemNoseNoseRingNPCReaction",
				},
			}
		}, // NoseRing
	}, // ItemNose
};
