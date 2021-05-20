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
	Require?: string[];
	SetPose?: string[];
	AllowPose: string[];
	HideForPose: string[];
	AllowActivePose?: string[];
	WhitelistActivePose?: string[];
	Value: number;
	Difficulty: number;
	SelfBondage: boolean;
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
	DynamicDescription: () => string;
	DynamicPreviewIcon: () => string;
	DynamicAllowInventoryAdd: () => boolean;
	DynamicExpressionTrigger: () => ExpressionTrigger;
	DynamicName: (C?: Character) => string;
	DynamicGroupName: string;
	DynamicActivity: () => string[] | string | undefined;
	DynamicAudio: (() => string) | null;
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
}

/** An ItemBundle is a minified version of the normal Item */
interface ItemBundle {
	Group: string;
	Name: string;
	Difficulty?: number;
	Color?: string | string[];
	Property?: Record<string, any>;
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

/** An item is a pair of asset and its dynamic properties that define a worn asset. */
interface Item {
	Asset: Asset;
	Color?: string | string[];
	Difficulty?: number;
	Property?: Record<string, any>;
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
	Name: string;
	AssetFamily: IAssetFamily;
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
}
