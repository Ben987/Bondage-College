//#region Common

interface String {
	replaceAt(index: number, character: string): string;
}

declare function parseInt(s: string | number, radix?: number): number;

type MemoizedFunction<T extends Function> = T & {
	/** Clears the cache of the memoized function */
	clearCache(): void;
};

//#endregion


type IAssetFamily = "Female3DCG";

interface AssetGroup {
	Family: IAssetFamily;
	Name: string;
	Description: string;
	ParentGroupName: string;
	Category: 'Appearance' | 'Item';
	IsDefault: boolean;
	IsRestraint: boolean;
	AllowNone: boolean;
	AllowColorize: boolean;
	AllowCustomize: boolean;
	ColorSchema: string[];
	ParentSize: string;
	ParentColor: string;
	Clothing: boolean;
	Underwear: boolean;
	BodyCosplay: boolean;
	Activity?: string[];
	AllowActivityOn?: string[];
	Hide?: string[];
	Block?: string[];
	Zone?: [number, number, number, number][];
	SetPose?: string[];
	AllowPose: string[];
	AllowExpression?: string[];
	Effect?: string[];
	MirrorGroup: string;
	RemoveItemOnRemove: { Group: string; Name: string; Type?: string }[];
	DrawingPriority: number;
	DrawingLeft: number;
	DrawingTop: number;
	DrawingFullAlpha: boolean;
	DrawingBlink: boolean;
	InheritColor?: string;
	FreezeActivePose: string[];
	PreviewZone?: [number, number, number, number][];
	DynamicGroupName: string;
}

/** An object defining a drawable layer of an asset */
interface AssetLayer {
	/** The name of the layer - may be null if the asset only contains a single default layer */
	Name: string | null;
	/** whether or not this layer can be colored */
	AllowColorize: boolean;
	/** if not null, specifies that this layer should always copy the color of the named layer */
	CopyLayerColor: string | null;
	/** specifies the name of a color group that this layer belongs to. Any layers within the same color group can be colored together via the item color UI */
	ColorGroup?: string;
	/** whether or not this layer can be coloured in the colouring UI */
	HideColoring: boolean;
	/** A list of allowed extended item types that this layer permits - the layer will only be drawn if
	the item type matches one of these types. If null, the layer is considered to permit all extended types. */
	AllowTypes: string[] | null;
	/** whether or not the layer has separate assets per type. If not, the extended type will not be included in
	the URL when fetching the layer's image */
	HasType: boolean;
	/** The name of the parent group for this layer. If null, the layer has no parent group. If
	undefined, the layer inherits its parent group from it's asset/group. */
	ParentGroupName?: string | null;
	/** An array of poses that this layer permits. If set, it will override the poses permitted
	by the parent asset/group. */
	AllowPose: string[] | null;
	/** An array of poses that this layer should be hidden for. */
	HideForPose: string[];
	/** The drawing priority of this layer. Inherited from the parent asset/group if not specified in the layer
	definition. */
	Priority: number;
	InheritColor?: string;
	Alpha: AlphaDefinition[];
	/** The asset that this layer belongs to */
	Asset: Asset;
	DrawingLeft?: number;
	DrawingTop?: number;
	HideAs?: { Group: string; Asset: string };
	HasImage: boolean;
	Opacity: number;
	MinOpacity: number;
	MaxOpacity: number;
	LockLayer: boolean;
	MirrorExpression?: string;
	AllowModuleTypes?: string[];
	/** The coloring index for this layer */
	ColorIndex: number;
	/** Any group-specific alpha masks that should be applied when drawing the layer. Only available on layers that have
	been created prior to drawing */
	GroupAlpha?: AlphaDefinition[];
}

/** An object defining a group of alpha masks to be applied when drawing an asset layer */
interface AlphaDefinition {
	/** A list of the group names that the given alpha masks should be applied to. If empty or not present, the
alpha masks will be applied to every layer underneath the present one. */
	Group?: string[];
	/** A list of the poses that the given alpha masks should be applied to. If empty or not present, the alpha
masks will be applied regardless of character pose. */
	Pose?: string[];
	/** A list of alpha mask definitions. A definition is a 4-tuple of numbers defining the top left coordinate of
a rectangle and the rectangle's width and height - e.g. [left, top, width, height] */
	Masks: [number, number, number, number][];
}

interface ExpressionTrigger {
	Group: string;
	Name: string;
	Timer: number;
}

interface Asset {
	Name: string;
	Description: string;
	Group: AssetGroup;
	ParentItem?: string;
	ParentGroupName?: string;
	Enable: boolean;
	Visible: boolean;
	Wear: boolean;
	Activity?: string[] | string;
	AllowActivity?: string[];
	AllowActivityOn?: string[];
	BuyGroup?: string;
	PrerequisiteBuyGroups?: string[];
	Effect?: string[];
	Bonus?: string;
	Block?: string[];
	Expose: string[];
	Hide?: string[];
	HideItem?: string[];
	HideItemExclude: string[];
	HideItemAttribute: string[];
	Require?: string[];
	SetPose?: string[];
	AllowPose: string[];
	HideForPose: string[];
	AllowActivePose?: string[];
	WhitelistActivePose?: string[];
	Value: number;
	Difficulty: number;
	SelfBondage: number;
	SelfUnlock: boolean;
	ExclusiveUnlock: boolean;
	Random: boolean;
	RemoveAtLogin: boolean;
	WearTime: number;
	RemoveTime: number;
	RemoveTimer: number;
	MaxTimer: number;
	DrawingPriority?: number;
	DrawingLeft?: number;
	DrawingTop?: number;
	HeightModifier: number;
	ZoomModifier: number;
	Alpha?: AlphaDefinition[];
	Prerequisite?: string | string[];
	Extended: boolean;
	AlwaysExtend: boolean;
	AlwaysInteract: boolean;
	AllowLock: boolean;
	IsLock: boolean;
	PickDifficulty: number;
	OwnerOnly: boolean;
	LoverOnly: boolean;
	ExpressionTrigger?: ExpressionTrigger[];
	RemoveItemOnRemove: { Name: string; Group: string; Type?: string; }[];
	AllowEffect?: string[];
	AllowBlock?: string[];
	AllowType?: string[];
	DefaultColor?: string | string[];
	Opacity: number;
	MinOpacity: number;
	MaxOpacity: number;
	Audio?: string;
	Category?: string[];
	Fetish?: string[];
	CustomBlindBackground?: Record<string, string>;
	ArousalZone: string;
	IsRestraint: boolean;
	BodyCosplay: boolean;
	OverrideBlinking: boolean;
	DialogSortOverride?: number;
	DynamicDescription: (C: Character) => string;
	DynamicPreviewIcon: (C: Character) => string;
	DynamicAllowInventoryAdd: (C: Character) => boolean;
	DynamicExpressionTrigger: (C: Character) => ExpressionTrigger[];
	DynamicName: (C?: Character) => string;
	DynamicGroupName: string;
	DynamicActivity: () => string[] | string | undefined;
	DynamicAudio: ((C: Character) => string) | null;
	CharacterRestricted: boolean;
	AllowRemoveExclusive: boolean;
	InheritColor?: string;
	DynamicBeforeDraw: boolean;
	DynamicAfterDraw: boolean;
	DynamicScriptDraw: boolean;
	HasType: boolean;
	AllowLockType?: string[];
	AllowColorizeAll: boolean;
	AvailableLocations: string[];
	OverrideHeight?: { Height: number; Priority: number; HeightRatioProportion?: number };
	FreezeActivePose: string[];
	DrawLocks: boolean;
	AllowExpression?: string[];
	MirrorExpression?: string;
	FixedPosition: boolean;
	Layer: AssetLayer[];
	ColorableLayerCount: number;
	Archetype?: string;
	Attribute: string[];
}

/** An ItemBundle is a minified version of the normal Item */
interface ItemBundle {
	Group: string;
	Name: string;
	Difficulty?: number;
	Color?: string | string[];
	Property?: ItemProperties;
}

/** An AppearanceBundle is whole minified appearance of a character */
type AppearanceBundle = ItemBundle[];

interface Pose {
	Name: string;
	Category?: 'BodyUpper' | 'BodyLower' | 'BodyFull';
	AllowMenu?: true;
	OverrideHeight?: { Height: number; Priority: number; };
	Hide?: string[];
	MovePosition?: { Group: string; X: number; Y: number; }[];
}

interface Activity {
	Name: string;
	MaxProgress: number;
	Prerequisite: string[];
	TargetSelf?: string[];
	MakeSound?: boolean;
}

/** An item is a pair of asset and its dynamic properties that define a worn asset. */
interface Item {
	Asset: Asset;
	Color?: string | string[];
	Difficulty?: number;
	Property?: ItemProperties;
}

interface Skill {
	Type: string;
	Level: number;
	Progress: number;
}

interface Reputation {
	Type: string;
	Value: number;
}

interface Ownership {
	Name: string;
	MemberNumber: number;
	Stage: number;
	Start: number;
}

interface Lovership {
	Name: string;
	MemberNumber?: number;
	Stage?: number;
	Start?: number;
}

interface Character {
	ID: number;
	/** Only on `Player` */
	OnlineID?: string;
	Name: string;
	AssetFamily: IAssetFamily | string;
	AccountName: string;
	Owner: string;
	Lover: string;
	Money: number;
	Inventory: any[];
	Appearance: Item[];
	Stage: string;
	CurrentDialog: string;
	Dialog: any[];
	Reputation: Reputation[];
	Skill: Skill[];
	Pose: string[];
	Effect: string[];
	FocusGroup: AssetGroup;
	Canvas: HTMLCanvasElement;
	CanvasBlink: HTMLCanvasElement;
	MustDraw: boolean;
	BlinkFactor: number;
	AllowItem: boolean;
	BlockItems: any[];
	LimitedItems: any[];
	WhiteList: number[];
	HeightModifier: number;
	MemberNumber?: number;
	ItemPermission?: number;
	Ownership?: Ownership;
	Lovership?: Lovership[];
	CanTalk: () => boolean;
	CanWalk: () => boolean;
	CanKneel: () => boolean;
	CanInteract: () => boolean;
	CanChange: () => boolean;
	IsProne: () => boolean;
	IsRestrained: () => boolean;
	IsBlind: () => boolean;
	IsEnclose: () => boolean;
	IsChaste: () => boolean;
	IsVulvaChaste: () => boolean;
	IsBreastChaste: () => boolean;
	IsEgged: () => boolean;
	IsOwned: () => boolean;
	IsOwnedByPlayer: () => boolean;
	IsOwner: () => boolean;
	IsKneeling: () => boolean;
	IsNaked: () => boolean;
	IsDeaf: () => boolean;
	HasNoItem: () => boolean;
	IsLoverOfPlayer: () => boolean;
	GetLoversNumbers: (MembersOnly?: boolean) => (number | string)[];
	AllowedActivePose: string[];
	HiddenItems: any[];
	HeightRatio: number;
	HasHiddenItems: boolean;
	GetBlindLevel: (eyesOnly?: boolean) => number;
	IsLocked: () => boolean;
	IsMounted: () => boolean;
	IsPlugged: () => boolean;
	IsShackled: () => boolean;
	IsSlow: () => boolean;
	IsMouthBlocked: () => boolean;
	IsMouthOpen: () => boolean;
	IsVulvaFull: () => boolean;
	IsOwnedByMemberNumber: (memberNumber: number) => boolean;
	IsLover: (C: Character) => boolean;
	IsLoverOfMemberNumber: (memberNumber: number) => boolean;
	GetDeafLevel: () => number;
	IsLoverPrivate: () => boolean;
	IsEdged: () => boolean;
	IsNpc: () => boolean;
	GetDifficulty: () => number;
	IsInverted: () => boolean;
	CanChangeToPose: (Pose: string) => boolean;
	GetClumsiness: () => number;
	DrawPose?: string[];
	DrawAppearance?: Item[];
	AppearanceLayers?: AssetLayer[];
	Hooks: Map<string, Map<string, any>> | null;
	RegisterHook: (hookName: string, hookInstance: string, callback: any) => boolean | any;
	UnregisterHook: (hookName: string, hookInstance: string) => boolean;
	HeightRatioProportion?: number;
	// Properties created in other places
	ArousalSettings?: {
		Active: string;
		Visible: string;
		ShowOtherMeter: boolean;
		AffectExpression: boolean;
		AffectStutter: string;
		VFX: string;
		Progress: number;
		ProgressTimer: number;
		VibratorLevel: number;
		ChangeTime: number;
		Activity: any[];
		Zone: any[];
		Fetish: any[];
		OrgasmTimer?: number;
		OrgasmStage?: number;
		OrgasmCount?: number;
        DisableAdvancedVibes: boolean;
	};
	AppearanceFull?: Item[];
	Trait?: any[];
	Event?: any[];
	// Online character properties
	Title?: string;
	ActivePose?: any;
	LabelColor?: any;
	Creation?: any;
	Description?: any;
	OnlineSharedSettings?: {
		AllowFullWardrobeAccess: boolean;
		BlockBodyCosplay: boolean;
		AllowPlayerLeashing: boolean;
		DisablePickingLocksOnSelf: boolean;
		GameVersion: string;
		ItemsAffectExpressions: boolean;
	};
	Game?: any;
	BlackList: number[];
	RunScripts?: boolean;
	HasScriptedAssets?: boolean;
	Cage?: true | null;
	Love?: number;
	Difficulty?: {
		Level: number;
		LastChange?: number;
	};
	ArousalZoom?: boolean;
	FixedImage?: string;
}

interface PlayerCharacter extends Character {
	ChatSettings?: {
	    ColorTheme: string;
	    EnterLeave: string;
	    MemberNumbers: string;
	    FontSize: string;
		DisplayTimestamps: boolean;
		ColorNames: boolean;
		ColorActions: boolean;
		ColorEmotes: boolean;
		ShowActivities: boolean;
		ShowAutomaticMessages: boolean;
		WhiteSpace: string;
		ColorActivities: boolean;
		ShrinkNonDialogue: boolean;
		MuStylePoses: boolean;
	};
	VisualSettings?: {
		ForceFullHeight: boolean;
		UseCharacterInPreviews: boolean;
	};
	AudioSettings?: {
		Volume: number;
		PlayBeeps: boolean;
		PlayItem: boolean;
		PlayItemPlayerOnly: boolean;
		Notifications: boolean;
	};
	ControllerSettings?: {
		ControllerSensitivity: number;
		ControllerDeadZone: number;
		ControllerA: number;
		ControllerB: number;
		ControllerX: number;
		ControllerY: number;
		ControllerStickUpDown: number;
		ControllerStickLeftRight: number;
		ControllerStickRight: number;
		ControllerStickDown: number;
		ControllerDPadUp: number;
		ControllerDPadDown: number;
		ControllerDPadLeft: number;
		ControllerDPadRight: number;
		ControllerActive: boolean;
	};
	GameplaySettings?: {
		SensDepChatLog: string;
		BlindDisableExamine: boolean;
		DisableAutoRemoveLogin: boolean;
		ImmersionLockSetting: boolean;
		EnableSafeword: boolean;
		DisableAutoMaid: boolean;
		OfflineLockedRestrained: boolean;
	};
	ImmersionSettings?: {
		BlockGaggedOOC: boolean;
		StimulationEvents: boolean;
		ReturnToChatRoom: boolean;
		ReturnToChatRoomAdmin: boolean;
		SenseDepMessages: boolean;
		ChatRoomMuffle: boolean;
	};
	LastChatRoom?: string;
	LastChatRoomBG?: string;
	LastChatRoomPrivate?: boolean;
	LastChatRoomSize?: number;
	LastChatRoomDesc?: string;
	LastChatRoomAdmin?: any[];
	LastChatRoomTimer?: any;
	RestrictionSettings?: {
		BypassStruggle: boolean;
		SlowImmunity: boolean;
		BypassNPCPunishments: boolean;
	};
	OnlineSettings?: {
		AutoBanBlackList: boolean;
		AutoBanGhostList: boolean;
		DisableAnimations: boolean;
		SearchShowsFullRooms: boolean;
		SearchFriendsFirst: boolean;
		EnableAfkTimer: boolean;
		EnableWardrobeIcon: boolean;
	};
	GraphicsSettings?: {
		Font: string;
		InvertRoom: boolean;
		StimulationFlashes: boolean;
		DoBlindFlash: boolean;
		AnimationQuality: number;
		StimulationFlash: boolean;
	}
	NotificationSettings?: {
		/** @deprecated */
		Audio?: boolean;
		Beeps: NotificationSetting;
		/** @deprecated */
		Chat?: any;
		ChatMessage: NotificationSetting & {
			/** @deprecated */
			IncludeActions?: any;
			Normal?: boolean;
			Whisper?: boolean;
			Activity?: boolean;
		};
		/** @deprecated */
		ChatActions?: any;
		ChatJoin: NotificationSetting & {
			/** @deprecated */
			Enabled?: any;
			Owner?: boolean;
			Lovers?: boolean;
			Friendlist?: boolean;
			Subs?: boolean;
		};
		Disconnect: NotificationSetting;
		Larp: NotificationSetting;
		Test: NotificationSetting;
	};
	GhostList?: number[];
	Wardrobe?: any[][];
	WardrobeCharacterNames?: string[];
	SavedExpressions?: any[];
	SavedColors?: HSVColor[];
	FriendList?: number[];
	FriendNames?: Map<number, string>;
	SubmissivesList?: Set<number>
}

//#region Extended items

interface ItemProperties {
	[key: string]: any;
}

/** An object containing the extended item definition for an asset. */
interface ExtendedItemAssetConfig {
	/** The extended item archetype that this asset uses. */
	Archetype: ExtendedArchetype;
	/** The specific configuration for the item (type will vary based on the item's archetype) */
	Config?: ModularItemConfig | TypedItemConfig;
	/** The group name and asset name of a configuration to copy - useful if multiple items share the same config */
	CopyConfig?: { GroupName?: string, AssetName: string };
}

/**
 * An object containing extended item definitions for a group.
 * Maps asset names within the group to their extended item configuration
 * @see {@link ExtendedItemAssetConfig}
 */
type ExtendedItemGroupConfig = Record<string, ExtendedItemAssetConfig>;

/**
 * An object containing extended item configurations keyed by group name.
 * @see {@link ExtendedItemAssetConfig}
 */
type ExtendedItemConfig = Record<string, ExtendedItemGroupConfig>;

/** Defines a single extended item option */
interface ExtendedItemOption {
	/** The name of the type - used for the preview icon and the translation key in the CSV */
	Name: string;
	/** The required bondage skill level for this option */
	BondageLevel?: number;
	/** The required self-bondage skill level for this option when using it on oneself */
	SelfBondageLevel?: number;
	/** The required prerequisites that must be met before this option can be selected */
	Prerequisite?: string|string[];
	/**
	 * Whether or not prerequisites should be considered on the character's
	 * appearance without the item equipped. Should be set to `true` if the item itself might interfere with prerequisites on
	 * some of its options
	 */
	SelfBlockCheck?: boolean;
	/**
	 * Whether or not it should be possible to change from this option to another
	 * option while the item is locked (if set to `false`, the player must be able to unlock the item to change its type) -
	 * defaults to `true`
	 */
	ChangeWhenLocked?: boolean;
	/** The Property object to be applied when this option is used */
	Property?: ItemProperties;
	/**
	 * Trigger this expression when changing to this option
	 *
	 * **Curretnly broken!**
	 */
	Expression?: ExpressionTrigger[];
	/** Whether or not the option should open a subscreen in the extended item menu */
	HasSubscreen?: boolean;
}

//#endregion

//#region Modular items

/** An object defining all of the required configuration for registering a modular item */
interface ModularItemConfig {
	/** The module definitions for the item */
	Modules: ModularItemModule[];
	/**
	 * The item's chatroom message setting. Determines the level of
	 * granularity for chatroom messages when the item's module values change.
	 */
	ChatSetting?: ModularItemChatSetting;
	/**
	 * A boolean indicating whether or not the item's type can be changed while the
	 * item is locked (if set to false, the player must be able to unlock the item to change its type). Defaults to `true`
	 */
	ChangeWhenLocked?: boolean;
}

/** An object describing a single module for a modular item. */
interface ModularItemModule {
	/** The name of this module - this is usually a human-readable string describing what the
	 * module represents (e.g. Straps). It is used for display text keys, and should be unique across all of the modules
	 * for the item.
	 */
	Name: string;
	/** The unique key for this module - this is used as a prefix to designate option names. Each
	 * options in the module will be named with the module's key, followed by the index of the option within the module's
	 * Options array. Keys should be alphabetical only (a-z, A-Z)
	 */
	Key: string;
	/** The list of option definitions that can be chosen within this module. */
	Options: ModularItemOption[];
}

/** An object describing a single option within a module for a modular item. */
interface ModularItemOption {
	/** The additional difficulty associated with this option - defaults to 0 */
	Difficulty?: number;
	/** The required bondage skill level for this option */
	BondageLevel?: number;
	/** The required self-bondage skill level for this option when using it on oneself */
	SelfBondageLevel?: number;
	/** A list of groups that this option blocks - defaults to [] */
	Block?: string[];
	/** A list of groups that this option hides - defaults to [] */
	Hide?: string[];
	/** A list of items that this option hides */
	HideItem?: string[];
	/** The Property object to be applied when this option is used */
	Property?: ItemProperties;
	/**
	 * Whether or not it should be possible to change from this option to another
	 * option while the item is locked (if set to `false`, the player must be able to unlock the item to change its type) -
	 * defaults to `true`
	 */
	ChangeWhenLocked?: boolean;
}

/** An object containing modular item configuration for an asset. Contains all of the necessary information for the
 * item's load, draw & click handlers.
 */
interface ModularItemData {
	/** A reference to the asset that this configuration is tied to */
	asset: Asset;
	/** The item's chatroom message setting. Determines the level of
	 * granularity for chatroom messages when the item's module values change.
	 */
	chatSetting: ModularItemChatSetting;
	/** The identifying key for the asset, in the format "<GroupName><AssetName>" */
	key: string;
	/** The prefix for generated functions */
	functionPrefix: string;
	/** The dialogue prefix for the player prompt that is displayed on each module's menu screen */
	dialogSelectPrefix: string;
	/** The dialogue prefix for the name of each module */
	dialogModulePrefix: string;
	/** The dialogue prefix for the name of each option */
	dialogOptionPrefix: string;
	/** The dialogue prefix that will be used for each of the item's chatroom messages */
	chatMessagePrefix: string;
	/** The module definitions for the modular item */
	modules: ModularItemModule[];
	/** Name of currently active module */
	currentModule: string;
	/** A lookup for the current page in the extended item menu for each of the item's modules */
	pages: Record<string, number>;
	/** A lookup for the draw data for each of the item's modules */
	drawData: Record<string, { pageCount: number, paginate: boolean, positions: number[][] }>;
	/** A lookup for the draw functions for each of the item's modules */
	drawFunctions: Record<string, () => void>;
	/** A lookup for the click functions for each of the item's modules */
	clickFunctions: Record<string, () => void>;
	/**
	 * A boolean indicating whether or not the item's type can be changed while the
	 * item is locked (if set to `false`, the player must be able to unlock the item to change its type). Defaults to `true`
	 */
	changeWhenLocked: boolean;
}

/** A 3-tuple (or 2-tuple) containing data for drawing a button in a modular item screen. A button definition takes the
 * format:
 * ```
 * [imageUrl, textKey, background]
 * ```
 * The imageUrl is the URL for the image that should be drawn in the button.
 * The textKey is the CSV key for the text that should be displayed in the button.
 * The background is an optional CSS color string defining the background color for the button.
 */
type ModularItemButtonDefinition = string[];

//#endregion

//#region Typed items

/** An object defining all of the required configuration for registering a typed item */
interface TypedItemConfig {
	/** The list of extended item options available for the item */
	Options: ExtendedItemOption[];
	/** The optional text configuration for the item. Custom text keys can be configured within this object */
	Dialog?: TypedItemDialogConfig;
	/**
	 * An optional array of chat tags that should be included in the dictionary of
	 * the chatroom message when the item's type is changed.
	 * Defaults to {@link CommonChatTags.SOURCE_CHAR} and {@link CommonChatTags.DEST_CHAR}
	 */
	ChatTags?: CommonChatTags[];
	/**
	 * The chat message setting for the item. This can be provided to allow
	 * finer-grained chatroom message keys for the item. Defaults to {@link TypedItemChatSetting.TO_ONLY}
	 */
	ChatSetting?: TypedItemChatSetting;
	/** A boolean indicating whether or not images should be drawn in this item's extended item menu. Defaults to `true` */
	DrawImages?: boolean;
	/**
	 * A boolean indicating whether or not the item's type can be changed while the
	 * item is locked (if set to `false`, the player must be able to unlock the item to change its type). Defaults to `true`
	 */
	ChangeWhenLocked?: boolean;
	/**
	 * An optional validation callback function which can be used by
	 * items to run additional validation for cases that aren't covered by configuration
	 */
	Validate?: TypedItemValidateCallback;
}

interface TypedItemDialogConfig {
	/**
	 * The key for the text that will be displayed at the top of the extended item screen
	 * (usually a prompt for the player to select a type). Defaults to `"<groupName><assetName>Select"`
	 */
	Load?: string;
	/**
	 * A prefix for text keys for the display names of the item's individual types. This
	 * will be suffixed with the option name to get the final key (i.e. `"<typePrefix><optionName>"`). Defaults to
	 * `"<groupName><assetName>"`
	 */
	TypePrefix?: string;
	/**
	 * A prefix for text keys for chat messages triggered by the item. Chat message keys
	 * will include the name of the new option, and depending on the chat setting, the name of the previous option:
	 * - For chat setting `FROM_TO`: `<chatPrefix><oldOptionName>To<newOptionName>`
	 * - For chat setting `TO_ONLY`: `<chatPrefix><newOptionName>`
	 */
	ChatPrefix?: string | TypedItemChatCallback;
	/**
	 * A prefix for text keys for NPC dialog. This will be suffixed with the option name
	 * to get the final NPC dialogue key (i.e. `"<npcPrefix><optionName>"`. Defaults to `"<groupName><assetName>"`
	 */
	NpcPrefix?: string;
}

/**
 * An object containing typed item configuration for an asset. Contains all of the necessary information for the item's
 * load, draw & click handlers.
 */
interface TypedItemData {
	/** The asset reference */
	asset: Asset;
	/** The list of extended item options available for the item */
	options: ExtendedItemOption[];
	/** A key uniquely identifying the asset */
	key: string;
	/** The common prefix used for all extended item functions associated with the asset */
	functionPrefix: string;
	/** A record containing various dialog keys used by the extended item screen */
	dialog: {
		/** The dialog key for the item's load text (usually a prompt to select the type) */
		load: string;
		/** The prefix used for dialog keys representing the display names of the item's types */
		typePrefix: string;
		/** The prefix used for dialog keys representing the item's chatroom messages when its type is changed */
		chatPrefix: string | TypedItemChatCallback;
		/** The prefix used for dialog keys representing an NPC's reactions to item type changes */
		npcPrefix: string;
	};
	/**
	 * An array of the chat message tags that should be included in the item's
	 * chatroom messages. Defaults to [{@link CommonChatTags.SOURCE_CHAR}, {@link CommonChatTags.DEST_CHAR}]
	 */
	chatTags: CommonChatTags[];
	/**
	 * The chat message setting for the item. This can be provided to allow
	 * finer-grained chatroom message keys for the item. Defaults to {@link TypedItemChatSetting.TO_ONLY}
	 */
	chatSetting?: TypedItemChatSetting;
	/** A boolean indicating whether or not images should be drawn in this item's extended item menu. Defaults to `true` */
	drawImages?: boolean;
	/**
	 * A boolean indicating whether or not the item's type can be changed while the
	 * item is locked (if set to false, the player must be able to unlock the item to change its type). Defaults to `true`
	 */
	changeWhenLocked?: boolean;
	/**
	 * An optional validation callback function which can be used by
	 * items to run additional validation for cases that aren't covered by configuration
	 */
	validate?: TypedItemValidateCallback;
}

/**
 * @param {object} chatData - An object containing data about the type change that triggered the chat message
 * @param {Character} chatData.C - A reference to the character wearing the item
 * @param {ExtendedItemOption} chatData.previousOption - The previously selected type option
 * @param {ExtendedItemOption} chatData.newOption - The newly selected type option
 * @param {number} chatData.previousIndex - The index of the previously selected type option in the item's options
 * config
 * @param {number} chatData.newIndex - The index of the newly selected type option in the item's options config
 * @returns {string} - The chat prefix that should be used for this type change
 */
type TypedItemChatCallback = (
    chatData: {C: Character; previousOption: ExtendedItemOption; newOption: ExtendedItemOption; previousIndex: number; newIndex: number;},
) => string;

/**
 * @param {Character} C - A reference to the character wearing the item
 * @param {ExtendedItemOption} Option - The newly selected type option
 * @returns {string} - Returns a non-empty message string if the item failed validation, or an empty string otherwise
 */
type TypedItemValidateCallback = (C: Character, Option: ExtendedItemOption) => string;

/**
 * A parameter object containing information used to validate and sanitize character appearance update diffs. An
 * appearance update has a source character (the player that sent the update) and a target character (the character
 * being updated). What is allowed in an update varies depending on the status of the target character in relation to
 * the source character (i.e. whether they are the target's lover/owner, or the target themselves, and also whether or
 * not they have been whitelisted by the target).
 */
interface AppearanceUpdateParameters {
    /** The character whose appearance is being updated */
    C: Character;
    /** Whether or not the source player is the same as the target player */
    fromSelf: boolean;
    /**
     * Whether or not the source player has permissions to use owner-only items (i.e. they are either the target
     * themselves, or the target's owner)
     */
    fromOwner: boolean;
    /**
     * Whether or not the source player has permissions to use lover-only items (i.e. they are the target themselves,
     * one of the target's lovers, or the target's owner, provided the target's lover rules permit their owner using
     * lover-only items)
     */
    fromLover: boolean;
    /** The member number of the source player */
    sourceMemberNumber: number;
}

/**
 * A wrapper object containing the results of a diff resolution. This includes the final item that the diff resolved to
 * (or null if the diff resulted in no item, for example in the case of item removal), along with a valid flag which
 * indicates whether or not the diff was fully valid or not.
 */
interface ItemDiffResolution {
    /**
     * The resulting item after resolution of the item diff, or null if the diff resulted in no item being equipped in
     * the given group
     */
    item: Item | null;
    /**
     * Whether or not the diff was fully valid. In most cases, an invalid diff will result in the whole appearance
     * update being rolled back, but in some cases the change will be accepted, but some properties may be modified to
     * keep the resulting item valid - in both situations, the valid flag will be returned as false, indicating that a
     * remedial appearance update should be made by the target player.
     */
    valid: boolean;
}

/**
 * A wrapper object containing the results of an appearance validation. Contains a sanitized appearance array and a
 * valid flag which indicates whether or not the appearance was fully valid or not.
 */
interface AppearanceValidationWrapper {
    /** The resulting appearance after validation */
    appearance: Item[];
    /**
     * Whether or not the appearance was valid. A value of false indicates that the appearance has been modified, and a
     * remedial appearance update should be made by the target player.
     */
    valid: boolean;
}

//#endregion
