"use strict"

/** @typedef {'AssetFamily'} IAssetFamily */

/**
 * @typedef {Object} IAssetGroup
 * @property {IAssetFamily} Family
 * @property {string} Name
 * @property {string} Description
 * @property {string} ParentGroupName
 * @property {('Appearance'|'Item')} Category
 * @property {boolean} IsDefault
 * @property {boolean} IsRestraint
 * @property {boolean} AllowNone
 * @property {boolean} AllowColorize
 * @property {boolean} AllowCustomize
 * @property {boolean} KeepNaked
 * @property {string[]} ColorSchema
 * @property {string} ParentSize
 * @property {string} ParentColor
 * @property {boolean} Clothing
 * @property {boolean} Underwear
 * @property {number[][]} Zone
 * @property {string[]} SetPose
 * @property {string[]} AllowPose
 * @property {string[]} AllowExpression
 * @property {string[]} Effect
 * @property {number} DrawingPriority
 * @property {number} DrawingLeft
 * @property {number} DrawingTop
 * @property {boolean} DrawingFullAlpha
 * @property {boolean} DrawingBlink
 */

/**
 * @typedef {Object} IAssetLayer
 * @property {string} Name
 * @property {boolean} AllowColorize
 * @property {string[]} AllowTypes
 * @property {boolean} HasExpression
 * @property {boolean} HasType
 * @property {string} NewParentGroupName
 * @property {string[]} OverrideAllowPose
 */

/**
 * @typedef {Object} IAssetBonus
 * @property {string} Type
 * @property {number} Factor
 */

/**
* @typedef {Object} IExpressionTrigger
* @property {string} Group
* @property {string} Name
* @property {number} Timer
*/

/**
 * @typedef {Object} IAsset
 * @property {string} Name
 * @property {string} Description
 * @property {IAssetGroup} Group
 * @property {string} ParentItem
 * @property {boolean} Enable
 * @property {boolean} Visible
 * @property {boolean} Wear
 * @property {string} BuyGroup
 * @property {string[]} PrerequisiteBuyGroups
 * @property {string[]} Effect
 * @property {IAssetBonus} Bonus
 * @property {string[]} Block
 * @property {string[]} Expose
 * @property {string[]} Hide
 * @property {string[]} HideItem
 * @property {string[]} Require
 * @property {string[]} SetPose
 * @property {string[]} AllowPose
 * @property {number} Value
 * @property {number} Difficulty
 * @property {boolean} SelfBondage
 * @property {boolean} SelfUnlock
 * @property {boolean} Random
 * @property {boolean} RemoveAtLogin
 * @property {number} WearTime
 * @property {number} RemoveTime
 * @property {number} RemoveTimer
 * @property {number} DrawingPriority
 * @property {number} HeightModifier
 * @property {number[][]} Alpha
 * @property {string} Prerequisite
 * @property {boolean} Extended
 * @property {boolean} AllowLock
 * @property {boolean} IsLock
 * @property {boolean} OwnerOnly
 * @property {IExpressionTrigger[]} ExpressionTrigger
 * @property {IAssetLayer[]} Layer
 * @property {string[]} AllowEffect
 * @property {string[]} AllowBlock
 * @property {string[]} AllowType
 * @property {boolean} IgnoreParentGroup
 * @property {boolean} IsRestraint
 * @property {() => string)} DynamicDescription
 * @property {() => string)} DynamicPreviewIcon
 * @property {() => boolean)} DynamicAllowInventoryAdd
 * @property {() => any)} DynamicExpressionTrigger
 */

/**
 * @typedef {Object} IPose
 * @property {string} Name
 * @property {number} OverrideHeight
 * @property {string[]} Hide
 */

/**
 * @typedef {Object} IItem
 * @property {IAsset} Asset
 * @property {string} Color
 * @property {number} Difficulty
 * @property {*} Property
 */

/**
 * @typedef {Object} ISkill
 * @property {string} Type
 * @property {number} Level
 * @property {number} Progress
 */

/**
 * @typedef {Object} IReputation
 * @property {string} Type
 * @property {number} Value
 */

/**
 * @typedef {Object} ICharacter
 * @property {number} ID
 * @property {string} Name
 * @property {IAssetFamily} AssetFamily
 * @property {string} AccountName
 * @property {string} Owner
 * @property {string} Lover
 * @property {number} Money
 * @property {any[]} Inventory
 * @property {IItem[]} Appearance
 * @property {string} Stage
 * @property {string} CurrentDialog
 * @property {any[]} Dialog
 * @property {IReputation[]} Reputation
 * @property {ISkill[]} Skill
 * @property {string[]} Pose
 * @property {string[]} Effect
 * @property {IAssetGroup} FocusGroup
 * @property {HTMLCanvasElement} Canvas
 * @property {HTMLCanvasElement} CanvasBlink
 * @property {boolean} MustDraw
 * @property {number} BlinkFactor
 * @property {boolean} AllowItem
 * @property {any[]} BlockItems
 * @property {number} HeightModifier
 * @property {() => boolean} CanTalk
 * @property {() => boolean} CanWalk
 * @property {() => boolean} CanKneel
 * @property {() => boolean} CanInteract
 * @property {() => boolean} CanChange
 * @property {() => boolean} IsProne
 * @property {() => boolean} IsRestrained
 * @property {() => boolean} IsBlind
 * @property {() => boolean} IsEnclose
 * @property {() => boolean} IsChaste
 * @property {() => boolean} IsVulvaChaste
 * @property {() => boolean} IsBreastChaste
 * @property {() => boolean} IsEgged
 * @property {() => boolean} IsOwned
 * @property {() => boolean} IsOwnedByPlayer
 * @property {() => boolean} IsOwner
 * @property {() => boolean} IsKneeling
 * @property {() => boolean} IsNaked
 * @property {() => boolean} IsDeaf
 * @property {() => boolean} HasNoItem
 */