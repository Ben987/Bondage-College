# Bondage Club - Changelog

This changelog follows the format outlined in [keepachangelog.com](https://keepachangelog.com/), with some slight differences. The change categories we use are:

* Added - for new features
* Removed - for now removed features
* Changed - for changes in existing functionality
* Fixed - for any bug fixes
* Technical - for any changes not visible to players
* Beta Fixes - for any fixes that occur during the beta/hotfix period

**Note to contributors:** To avoid merge conflicts, please don't update this file yourself in your PRs - one of the developers will update the changelog with your change before your PR is merged.

Changelog last updated: 2021-02-17

Last recorded PR: [#2127](https://github.com/Ben987/Bondage-College/pull/2127)

## [R65]

### [Added]

* Jomshir/Aeren - Extended player bios to officially support up to 10,000 characters, and increased the maximum length of chat messages to 1,000 characters ([#1967](https://github.com/Ben987/Bondage-College/pull/1967))
> ![Warning](./Icons/Warning.svg) **Important Note:** After migrating to the beta, switching back to R64 will cause your bio to appear garbled - subsequently changing your bio in R64 _will_ break your bio - please do not do this! You can still edit your bio in the beta without any issues.
* wildsj - Added a new Hollow Butt Plug item ([#1947](https://github.com/Ben987/Bondage-College/pull/1947))
* Emily R - Added a new option to the Vacbed to allow hair/accessories to be visible ([#1940](https://github.com/Ben987/Bondage-College/pull/1940), [#1984](https://github.com/Ben987/Bondage-College/pull/1984))
* Ellie - Added 5 new backgrounds ([#1932](https://github.com/Ben987/Bondage-College/pull/1932))
* Ada - Added a new Timer Password Padlock ([#1925](https://github.com/Ben987/Bondage-College/pull/1925))
* Sandrine - Refactored all remaining "simple" vibrators to use the new advanced vibrator modes ([#1918](https://github.com/Ben987/Bondage-College/pull/1918), [#1916](https://github.com/Ben987/Bondage-College/pull/1916), [#1915](https://github.com/Ben987/Bondage-College/pull/1915), [#1913](https://github.com/Ben987/Bondage-College/pull/1913), [#1911](https://github.com/Ben987/Bondage-College/pull/1911), [#1910](https://github.com/Ben987/Bondage-College/pull/1910), [#1909](https://github.com/Ben987/Bondage-College/pull/1909), [#1908](https://github.com/Ben987/Bondage-College/pull/1908), [#1903](https://github.com/Ben987/Bondage-College/pull/1903), [#1914](https://github.com/Ben987/Bondage-College/pull/1914))
* Ayesha - Added ceiling rope & ceiling chain items ([#1899](https://github.com/Ben987/Bondage-College/pull/1899))
* Ada - Added a new feature to the Futuristic Collar to allow it to prevent remotes from being used on the wearer ([#1890](https://github.com/Ben987/Bondage-College/pull/1890))
* Ellie - Added support for variable opacity & custom text to the Wooden Box and Transport Box ([#1931](https://github.com/Ben987/Bondage-College/pull/1931), [#2026](https://github.com/Ben987/Bondage-College/pull/2026))
* Ada - Added seven new items ([#1963](https://github.com/Ben987/Bondage-College/pull/1963), [#2018](https://github.com/Ben987/Bondage-College/pull/2018), [#2023](https://github.com/Ben987/Bondage-College/pull/2023), [#2021](https://github.com/Ben987/Bondage-College/pull/2021), [#2028](https://github.com/Ben987/Bondage-College/pull/2028), [#2037](https://github.com/Ben987/Bondage-College/pull/2037), [#2054](https://github.com/Ben987/Bondage-College/pull/2054))
    * Grill
    * Spatula handheld toy
    * Futuristic Earphones
    * Futuristic Ballgag
    * Futuristic Vibrator
    * Kigurumi Mask
    * Futuristic Straitjacket
* wildsj - Added multicolor support to the Latex Strait Leotard, allowing it to be coloured in the style of a bunny suit ([#1922](https://github.com/Ben987/Bondage-College/pull/1922))
* Nina - Added chatroom and beep notifications, displayed in the browser tab title (configurable from player preferences) ([#1904](https://github.com/Ben987/Bondage-College/pull/1904), [#2049](https://github.com/Ben987/Bondage-College/pull/2049))
* Ada - Added lockpicking functionality to some locks ([#1675](https://github.com/Ben987/Bondage-College/pull/1675), [#1965](https://github.com/Ben987/Bondage-College/pull/1965), [#1972](https://github.com/Ben987/Bondage-College/pull/1972), [#1964](https://github.com/Ben987/Bondage-College/pull/1964), [#1980](https://github.com/Ben987/Bondage-College/pull/1980), [#1986](https://github.com/Ben987/Bondage-College/pull/1986), [#1988](https://github.com/Ben987/Bondage-College/pull/1988), [#2001](https://github.com/Ben987/Bondage-College/pull/2001), [#2016](https://github.com/Ben987/Bondage-College/pull/2016))
    * Lockpicking requires a lockpick, which you can obtain from the shop 
    * You have to set the pins of the lock in the right order by clicking them
    * You have a limited number of chances before you have to start over, but the pin order stays the same regardless of how many times you reset 
    * Pins are likely to false set, but they have a chance to reset as you try to pick other pins, thus obfuscating the correct order
* Jomshir/Claudia - Added a Floor Shackles item & added suspension support to the Ceiling Shackles ([#1968](https://github.com/Ben987/Bondage-College/pull/1968), [#1976](https://github.com/Ben987/Bondage-College/pull/1976))
* Ayesha - Added 10 new handheld toys ([#1960](https://github.com/Ben987/Bondage-College/pull/1960))
* Ellie - Added a new Halo cosplay item ([#1954](https://github.com/Ben987/Bondage-College/pull/1954))
* Nina - Added a color picker button to the clothing selection subscreen ([#1973](https://github.com/Ben987/Bondage-College/pull/1973))
* fleisch11 - Added controller support to the game (configurable in player preferences) ([#1835](https://github.com/Ben987/Bondage-College/pull/1835), [#2003](https://github.com/Ben987/Bondage-College/pull/2003), [#2006](https://github.com/Ben987/Bondage-College/pull/2006), [#2048](https://github.com/Ben987/Bondage-College/pull/2048))
* ZFreak - Added a new Pet Bed item ([#1978](https://github.com/Ben987/Bondage-College/pull/1978))
* Jomshir/Claudia - Added a new "Above Head" variation to the Wrist Shackles ([#1982](https://github.com/Ben987/Bondage-College/pull/1982))
* Ada - Added events when plugged/vibed, configurable from immersion preferences ([#1985](https://github.com/Ben987/Bondage-College/pull/1985), [#1997](https://github.com/Ben987/Bondage-College/pull/1997), [#2000](https://github.com/Ben987/Bondage-College/pull/2000))
    * Events can display chat messages (only visible to the player) and cause the screen to flash
* Nina - Added the ability for players to configure their item permissions even when a zone is currently blocked ([#1998](https://github.com/Ben987/Bondage-College/pull/1998))
* Jomshir/Claudia - Added a new Pet Bowl item with custom text support ([#2008](https://github.com/Ben987/Bondage-College/pull/2008))
* Ellie - Added pantyhose and stocking items to the Suit Lower slot ([#2009](https://github.com/Ben987/Bondage-College/pull/2009))
* Nina - Added left/right scroll buttons to the character appearance screen ([#1979](https://github.com/Ben987/Bondage-College/pull/1979), [#2011](https://github.com/Ben987/Bondage-College/pull/2011))
* Nina - Added a new visibility button to chatrooms to allow icons, arousal meters and player names to be hidden ([#2013](https://github.com/Ben987/Bondage-College/pull/2013))
* Nina - Added a new camera button to chatrooms to allow players to take a snapshot of the current chatroom ([#2014](https://github.com/Ben987/Bondage-College/pull/2014), [#2050](https://github.com/Ben987/Bondage-College/pull/2050))
* Ada - Added a new immersion preference to hide chatroom activities and actions when in sensory deprivation ([#2020](https://github.com/Ben987/Bondage-College/pull/2020), [#2042](https://github.com/Ben987/Bondage-College/pull/2042))
    * If your sensory deprivation level is set to "Total" or higher, this will also hide chat messages unless they involve you
* Ada - Added a new "Noise-Cancelling" option to earbuds and headphones ([#2019](https://github.com/Ben987/Bondage-College/pull/2019))
* Firefly - added multi-coloring support to the crib, along with several other improvements ([#2027](https://github.com/Ben987/Bondage-College/pull/2027))
* Aeren - Added extended item support to player wardrobes ([#2015](https://github.com/Ben987/Bondage-College/pull/2015))
* Ellie - Added multi-coloring to the blackout lenses, as well as better support for blinking/winking ([#2025](https://github.com/Ben987/Bondage-College/pull/2025))
* Ada - Added support for colorable locks to all Futuristic items ([#2041](https://github.com/Ben987/Bondage-College/pull/2041))
* Cecilia/Ellie - Added a new Transport Jacket item ([#2046](https://github.com/Ben987/Bondage-College/pull/2046))

### [Removed]

* Nothing in this release

### [Changed]

* Nina - Changed the positioning of names in chatrooms to prevent letters with descenders (e.g. "g", "j", "q", "y") from being cut off ([#1945](https://github.com/Ben987/Bondage-College/pull/1945))
* wildsj - Tweaked the positions of several tail/butt plug items to make more sense ([#1943](https://github.com/Ben987/Bondage-College/pull/1943))
* Sandrine - Changed the wooden sign so that it now displays above most items ([#1926](https://github.com/Ben987/Bondage-College/pull/1926))
* Ada - Changed the Futuristic Harnesses so that they will now render above the Futuristic Bra ()
* Nina - Changed the behaviour of combination & password padlocks in extreme mode ([#1904](https://github.com/Ben987/Bondage-College/pull/1904))
    * These locks will now be usable by people on an extreme mode player's whitelist
* Ada - Changed the Hemp Rope crotch rope so that the "Over Panties" option no longer appears to sink into the panties ([#1983](https://github.com/Ben987/Bondage-College/pull/1983))
* Ada - Changed arousal meter visual effects to be more responsive ([#1987](https://github.com/Ben987/Bondage-College/pull/1987))
* Nina - Changed the dress icons in the Shibari Dojo, Gambling Hall and Asylum therapy rooms to better indicate that they redress the player ([#1996](https://github.com/Ben987/Bondage-College/pull/1996))
* Ellie - Modified the Wooden Box to better support the kneeling pose ([#1992](https://github.com/Ben987/Bondage-College/pull/1992))
* Nina - Changed the arm Hemp Rope and Chain items to default to the basic wrist tie (NPCs will still use the boxtie) ([#1995](https://github.com/Ben987/Bondage-College/pull/1995))
* Ada - Reduced the shock cooldown on the Futuristic Chastity Belt ([#2017](https://github.com/Ben987/Bondage-College/pull/2017))
* Nina - Changed the Wooden Sign to stop it from defying gravity when suspended ([#2038](https://github.com/Ben987/Bondage-College/pull/2038))
* Ada Changed sensory deprivation to replace names with "Someone" in emotes ([#2043](https://github.com/Ben987/Bondage-College/pull/2043))
* Ada - Combined the Futuristic Harnesses into a single item, and changed them to now render above the Futuristic Bra ([#1961](https://github.com/Ben987/Bondage-College/pull/1961), [#2041](https://github.com/Ben987/Bondage-College/pull/2041))
* Ada - Added the "Copy Colors" feature to the Futuristic Harness ([#2017](https://github.com/Ben987/Bondage-College/pull/2017))

### [Fixed]

* Ellie - Added resource retry logic, which should substantially reduce the chances of seeing "MISSING VALUE FOR TAG" and similar errors ([#1948](https://github.com/Ben987/Bondage-College/pull/1948))
* Emily R - Fixed some visual issues with the Flippers in combination with most full-body items ([#1940](https://github.com/Ben987/Bondage-College/pull/1940))
* Ellie - Fixed some graphical issues with the medium collar chain ([#1952](https://github.com/Ben987/Bondage-College/pull/1952))
* Sandrine - Changed the "up" button for kneeling/hogtied characters to line up with the expression menu buttons ([#1935](https://github.com/Ben987/Bondage-College/pull/1935))
* Ellie - Fixed an issue which would allow non-owners/lovers to add owner/lover padlocks to others via the console ([#1959](https://github.com/Ben987/Bondage-College/pull/1959))
* Ellie - Fixed a visual issue with the lock asset for the Futuristic Arm Cuffs in the yoked pose ([#1957](https://github.com/Ben987/Bondage-College/pull/1957))
* Ayesha - Reinstated default colors to several collars ([#1893](https://github.com/Ben987/Bondage-College/pull/1893))
* Ellie - Fixed an issue where players could not break up with a lover whose account no longer existed ([Server #63](https://github.com/Ben987/Bondage-Club-Server/pull/63))
* Ellie - Fixed an issue where changes to owner/lover rules would not be displayed in the target player's chat log ([#1966](https://github.com/Ben987/Bondage-College/pull/1966))
* tickler2000 - Fixed an issue where handheld toys sometimes displaying the same preview image for every toy ([#1977](https://github.com/Ben987/Bondage-College/pull/1977))
* Ellie - Fixed a bug where bed restraints would not be removed on relog with the bed, soft-locking the player ([#1975](https://github.com/Ben987/Bondage-College/pull/1975))
* Nina - Fixed an issue where the bed spread eagle variation of the legs hemp rope would prevent players from using their arms ([#1974](https://github.com/Ben987/Bondage-College/pull/1974))
* Emily R - Fixed some graphical issues with the Padded Mittens, Paw Mittens, Body Suits and Reverse Bunny Suits ([#2002](https://github.com/Ben987/Bondage-College/pull/2002))
* Ellie - Fixed an issue where limited permissions weren't being respected for handheld toys ([#2012](https://github.com/Ben987/Bondage-College/pull/2012))
* Ada - Fixed an issue with the Futuristic Collar which meant that anyone could change permissions on the collar ([#2024](https://github.com/Ben987/Bondage-College/pull/2024))
* Nina - Fixed an issue with the chatroom messages on the Tight Straitjacket ([#2036](https://github.com/Ben987/Bondage-College/pull/2036))
* Jomshir - Fixed a rendering issue when moving between rooms on devices with a slower connection ([#2032](https://github.com/Ben987/Bondage-College/pull/2032))
* Ellie - Fixed a bug where the expression reset button was resetting players' mouth color ([#2053](https://github.com/Ben987/Bondage-College/pull/2053))
* Ellie - Fixed an issue where players could not add/remove time from the Owner Timer Padlock ([#2056](https://github.com/Ben987/Bondage-College/pull/2056))

### [Technical]

* Jomshir - Added an asset-checking script to help identify and fix asset definition errors ([#1955](https://github.com/Ben987/Bondage-College/pull/1955), [#1962](https://github.com/Ben987/Bondage-College/pull/1962))
* Ellie - Added support for variable item opacity, and new slider controls ([#1931](https://github.com/Ben987/Bondage-College/pull/1931))
* Ellie - Added functionality to allow assets to be reused across items to reduce game bandwidth & memory usage ([#1936](https://github.com/Ben987/Bondage-College/pull/1936), [#1969](https://github.com/Ben987/Bondage-College/pull/1969))
* Nina - Reworked the menu buttons in the character appearance screen ([#1970](https://github.com/Ben987/Bondage-College/pull/1970))
* Jomshir - Optimized the handling of in-game text ([#1981](https://github.com/Ben987/Bondage-College/pull/1981), [#2030](https://github.com/Ben987/Bondage-College/pull/2030))
* Ellie - Reworked custom text functionality on several items into a series of utility functions to make it easier for contributors to add custom text to items ([#2022](https://github.com/Ben987/Bondage-College/pull/2022))
* Sekkmer - Added several optimizations to the game's drawing functions ([#1507](https://github.com/Ben987/Bondage-College/pull/1507))
* Jomshir - Reworked the chess minigame to address several issues, including the game causing disconnects on slower devices ([#2035](https://github.com/Ben987/Bondage-College/pull/2035))
* Ellie - Reworked the High Security Straitjacket's code into common functions to allow contributors to easily add other modular items ([#2045](https://github.com/Ben987/Bondage-College/pull/2045))
* Nina - Added new functionality to allow assets to be positioned absolutely rather than relative to the character ([#2084](https://github.com/Ben987/Bondage-College/pull/2084))
* Lots of technical changes, fixes and improvements:
  * Nina - [#1940](https://github.com/Ben987/Bondage-College/pull/1940), [#1923](https://github.com/Ben987/Bondage-College/pull/1923), [#1994](https://github.com/Ben987/Bondage-College/pull/1994), [#2007](https://github.com/Ben987/Bondage-College/pull/2007)
  * Ellie - [#1953](https://github.com/Ben987/Bondage-College/pull/1953), [#1989](https://github.com/Ben987/Bondage-College/pull/1989), [#1999](https://github.com/Ben987/Bondage-College/pull/1999), [#2005](https://github.com/Ben987/Bondage-College/pull/2005), [#2004](https://github.com/Ben987/Bondage-College/pull/2004), [#2010](https://github.com/Ben987/Bondage-College/pull/2010), [#2033](https://github.com/Ben987/Bondage-College/pull/2033), [#2031](https://github.com/Ben987/Bondage-College/pull/2031), [#2044](https://github.com/Ben987/Bondage-College/pull/2044), [#2051](https://github.com/Ben987/Bondage-College/pull/2051), [#2057](https://github.com/Ben987/Bondage-College/pull/2057)
  * Jomshir - [Server #64](https://github.com/Ben987/Bondage-Club-Server/pull/64), [#1958](https://github.com/Ben987/Bondage-College/pull/1958), [#1991](https://github.com/Ben987/Bondage-College/pull/1991), [Server #65](https://github.com/Ben987/Bondage-Club-Server/pull/65), [#2040](https://github.com/Ben987/Bondage-College/pull/2040)
  * Sekkmer - [#2034](https://github.com/Ben987/Bondage-College/pull/2034)
  * Ada - [#2055](https://github.com/Ben987/Bondage-College/pull/2055)

### [Beta Fixes]

* Jomshir - [Server #66](https://github.com/Ben987/Bondage-Club-Server/pull/66), [#2081](https://github.com/Ben987/Bondage-College/pull/2081), [#2083](https://github.com/Ben987/Bondage-College/pull/2083), [#2090](https://github.com/Ben987/Bondage-College/pull/2090), [#2094](https://github.com/Ben987/Bondage-College/pull/2094), [#2099](https://github.com/Ben987/Bondage-College/pull/2099), [#2112](https://github.com/Ben987/Bondage-College/pull/2112)
* Nina - [#2063](https://github.com/Ben987/Bondage-College/pull/2063), [#2064](https://github.com/Ben987/Bondage-College/pull/2064), [#2067](https://github.com/Ben987/Bondage-College/pull/2067), [#2069](https://github.com/Ben987/Bondage-College/pull/2069), [#2071](https://github.com/Ben987/Bondage-College/pull/2071), [#2084](https://github.com/Ben987/Bondage-College/pull/2084), [#2088](https://github.com/Ben987/Bondage-College/pull/2088), [#2089](https://github.com/Ben987/Bondage-College/pull/2089), [#2085](https://github.com/Ben987/Bondage-College/pull/2085), [#2087](https://github.com/Ben987/Bondage-College/pull/2087), [#2092](https://github.com/Ben987/Bondage-College/pull/2092), [#2095](https://github.com/Ben987/Bondage-College/pull/2095), [#2096](https://github.com/Ben987/Bondage-College/pull/2096), [#2097](https://github.com/Ben987/Bondage-College/pull/2097), [#2102](https://github.com/Ben987/Bondage-College/pull/2102), [#2104](https://github.com/Ben987/Bondage-College/pull/2104), [#2114](https://github.com/Ben987/Bondage-College/pull/2114), [#2116](https://github.com/Ben987/Bondage-College/pull/2116), [#2117](https://github.com/Ben987/Bondage-College/pull/2117), [#2125](https://github.com/Ben987/Bondage-College/pull/2125)
* Ellie - [#2065](https://github.com/Ben987/Bondage-College/pull/2065), [#2066](https://github.com/Ben987/Bondage-College/pull/2066), [#2073](https://github.com/Ben987/Bondage-College/pull/2073), [#2074](https://github.com/Ben987/Bondage-College/pull/2074), [#2076](https://github.com/Ben987/Bondage-College/pull/2076), [#2082](https://github.com/Ben987/Bondage-College/pull/2082), [#2093](https://github.com/Ben987/Bondage-College/pull/2093), [#2098](https://github.com/Ben987/Bondage-College/pull/2098), [#2105](https://github.com/Ben987/Bondage-College/pull/2105), [#2106](https://github.com/Ben987/Bondage-College/pull/2106), [#2107](https://github.com/Ben987/Bondage-College/pull/2107), [#2108](https://github.com/Ben987/Bondage-College/pull/2108), [#2109](https://github.com/Ben987/Bondage-College/pull/2109), [#2113](https://github.com/Ben987/Bondage-College/pull/2113), [#2118](https://github.com/Ben987/Bondage-College/pull/2118), [#2122](https://github.com/Ben987/Bondage-College/pull/2122), [#2127](https://github.com/Ben987/Bondage-College/pull/2127)
* Sekkmer - [#2068](https://github.com/Ben987/Bondage-College/pull/2068)
* Ada - [#2070](https://github.com/Ben987/Bondage-College/pull/2070), [#2072](https://github.com/Ben987/Bondage-College/pull/2072), [#2077](https://github.com/Ben987/Bondage-College/pull/2077), [#2078](https://github.com/Ben987/Bondage-College/pull/2078), [#2080](https://github.com/Ben987/Bondage-College/pull/2080), [#2100](https://github.com/Ben987/Bondage-College/pull/2100), [#2103](https://github.com/Ben987/Bondage-College/pull/2103), [#2110](https://github.com/Ben987/Bondage-College/pull/2110), [#2120](https://github.com/Ben987/Bondage-College/pull/2121)
* ZFreak - [#2079](https://github.com/Ben987/Bondage-College/pull/2079), [#2086](https://github.com/Ben987/Bondage-College/pull/2086), [#2091](https://github.com/Ben987/Bondage-College/pull/2091)

###

## [R64]

### [Added]

* Rui - Added several new items ([#1808](https://github.com/Ben987/Bondage-College/pull/1808), [#1814](https://github.com/Ben987/Bondage-College/pull/1814), [#1815](https://github.com/Ben987/Bondage-College/pull/1815), [#1805](https://github.com/Ben987/Bondage-College/pull/1805))
    * Latex Ankle Shoes
    * Strict Leather Pet Crawler
    * Elegant Heart Necklace
    * Noble Corset
* Emily R - Added a new whisper emoticon ([#1807](https://github.com/Ben987/Bondage-College/pull/1807))
* Rui - Moved corset clothing items into a new dedicated corset slot ([#1804](https://github.com/Ben987/Bondage-College/pull/1804))
    * Unfortunately this means that any corsets you previously owned in the bra slot will need to be purchased again
* Gnarp - Added spread eagle variations to the arm and feet hemp rope items, available when on a bed ([#1796](https://github.com/Ben987/Bondage-College/pull/1796))
* Nina - Added the ability to scroll to the bottom of the chat in a chatroom by pressing the `Esc` key ([#1792](https://github.com/Ben987/Bondage-College/pull/1792))
* Ada - Extended the ball gag, harness ball gag, and wiffle gag with additional visual options ([#1788](https://github.com/Ben987/Bondage-College/pull/1788))
* Ace - Added the ability to customize the degree of blindness that occurs when both eyes are closed ([#1784](https://github.com/Ben987/Bondage-College/pull/1784))
* Ada - Added several more new items ([#1756](https://github.com/Ben987/Bondage-College/pull/1756), [#1757](https://github.com/Ben987/Bondage-College/pull/1757), [#1758](https://github.com/Ben987/Bondage-College/pull/1758))
    * Futuristic Chastity Panties
    * Futuristic Breast Harness
    * Futuristic Harness
* Emily R - Added 3 new items ([#1817](https://github.com/Ben987/Bondage-College/pull/1817), [#1843](https://github.com/Ben987/Bondage-College/pull/1843), [#1857](https://github.com/Ben987/Bondage-College/pull/1857), [#1891](https://github.com/Ben987/Bondage-College/pull/1891)) 
    * Funnel Gag
    * Headphones
    * Flippers
* Nina - Allowed the pose menu to be used inside the photography room, and the ability to pose the photography room NPC ([#1764](https://github.com/Ben987/Bondage-College/pull/1764), [#1772](https://github.com/Ben987/Bondage-College/pull/1772))
* Sekkmer/Ellie - Added the ability for owners to add lover locks to subs with lovers ([#1387](https://github.com/Ben987/Bondage-College/pull/1387))
    * Players can now enforce some rules upon their lover(s), similar to owner rules
    * Lover rule: prevent/allow a lover from using lover locks on themselves - allowed by default
    * Lover rule: prevent/allow a lover's owner from using lover locks on her - allowed by default
* Ace - Added the ability inside your private room to choose the background of your private room or the main hall ([#1786](https://github.com/Ben987/Bondage-College/pull/1786))
* Cecilia/Ellie - Added two new items ([#1778](https://github.com/Ben987/Bondage-College/pull/1778), [#1860](https://github.com/Ben987/Bondage-College/pull/1860))
    * A set of medical bed restraints, which can be obtained (as either a nurse or a patient) from the Asylum
    * Vac-Cube
* Saya - Added the ability for players to change the game font through their graphical preference page ([#1799](https://github.com/Ben987/Bondage-College/pull/1799))
* Ada - Added functionality to allow room owners to block the use of player leashing within their rooms ([#1831](https://github.com/Ben987/Bondage-College/pull/1831))
* Aeren - Added 16 new player titles and tweaked the unlock requirements for certain titles ([#1713](https://github.com/Ben987/Bondage-College/pull/1713))
* Ada - Added an immersion preference that allows players to be returned to their previous chatroom upon relogging ([#1670](https://github.com/Ben987/Bondage-College/pull/1670), [#1836](https://github.com/Ben987/Bondage-College/pull/1836), [#1837](https://github.com/Ben987/Bondage-College/pull/1837), [#1839](https://github.com/Ben987/Bondage-College/pull/1839))
* Ayesha - Added a new Transport Box item ([#1795](https://github.com/Ben987/Bondage-College/pull/1795))
* Emily R - Added multicolor support to the Leather Hood ([#1843](https://github.com/Ben987/Bondage-College/pull/1843))
* Nina - Added a new graphics preference which will flip rooms vertically when the player is suspended upside down ([#1846](https://github.com/Ben987/Bondage-College/pull/1846))
* wildsj - Added multicolor support to the Harness Pacifier ([#1849](https://github.com/Ben987/Bondage-College/pull/1849))
* Jomshir - Added a new Ceiling Shackles item ([#1851](https://github.com/Ben987/Bondage-College/pull/1851))
* Ellie - Added the ability to add custom text to the Canvas Hood ([#1861](https://github.com/Ben987/Bondage-College/pull/1861))
* Ellie - Added new alternative light & dark chatroom themes ([#1862](https://github.com/Ben987/Bondage-College/pull/1862))
* Nina - Added multicolor support to the Kitty Butt Plug and the Fox Tails butt plug ([#1863](https://github.com/Ben987/Bondage-College/pull/1863))
* Leah - Added a new "Outside Cells" background for the Asylum ([#1884](https://github.com/Ben987/Bondage-College/pull/1884))
* Ellie - Added a "Reset to default" button to the color picker ([#1898](https://github.com/Ben987/Bondage-College/pull/1898))

### [Removed]

* Nothing this release

### [Changed]

* Sandrine - Most extended items have now been modified so that incompatible types are displayed in red ([#1511](https://github.com/Ben987/Bondage-College/pull/1511))
* Jomshir - Offline friends will no long appear in the first tab, but can still be seen in the third tab, where the delete buttons are ([#1773](https://github.com/Ben987/Bondage-College/pull/1773))
* Ada - Changed the post-struggle cooldown of the Futuristic Chastity Belt's shock function from 30 seconds to 15 ([#1834](https://github.com/Ben987/Bondage-College/pull/1834))
* tickler2000 - Extended the range of activities available on 18 items ([#1838](https://github.com/Ben987/Bondage-College/pull/1838), [#1848](https://github.com/Ben987/Bondage-College/pull/1848))
* Ellie - Coloring of blush, fluids and emoticons has been moved from the appearance menu to the expression menu ([#1853](https://github.com/Ben987/Bondage-College/pull/1853))
    * The left/right wink buttons in the expression menu have been merged into a single wink/blink button that cycles through the wink/blink combinations

### [Fixed]

* Wultir - Fixed an issue where being enclosed would not prevent you from being leashed out of a room ([#1810](https://github.com/Ben987/Bondage-College/pull/1810))
* Ellie - Fixed an issue with the login credits scrolling too fast at higher framerates ([#1809](https://github.com/Ben987/Bondage-College/pull/1809))
* Nina - Fixed an issue where a game crash on the login screen would cause your character's appearance to be randomized on next login ([#1789](https://github.com/Ben987/Bondage-College/pull/1789))
* Ellie - Fixed an issue that would cause the friends list not to work for new players until a relog ([#1816](https://github.com/Ben987/Bondage-College/pull/1816))
* Nina - Fixed a bug where the "( Character Actions )" dialogue option would not always show up when it should ([#1820](https://github.com/Ben987/Bondage-College/pull/1820))
* Sandrine - Fixed an issue with the magic club where equipping the adult baby harness with mitten chain could leave characters in an inconsistent state ([#1037](https://github.com/Ben987/Bondage-College/pull/1037))
* Ace - Fixed an issue where players' preferences would not get initialised until after visiting the preferences page ([#1743](https://github.com/Ben987/Bondage-College/pull/1743))
* Wultir - Fixed an issue where players with owner/lover locked leashes could be leashed out of rooms by non-owners/lovers ([#1801](https://github.com/Ben987/Bondage-College/pull/1801))
* Ace - Fixed some edge case issues in the pose system which would allow incorrect poses under certain conditions ([#1806](https://github.com/Ben987/Bondage-College/pull/1806))
* Ada - Fixed some graphical issues with lock icons on the Futuristic Ankle Cuffs ([#1832](https://github.com/Ben987/Bondage-College/pull/1832))
* Ellie - Fixed clipping issues with the Open Crotch Straitdress when worn over lower body clothing ([#1829](https://github.com/Ben987/Bondage-College/pull/1829))
* Nina - Fixed an issue when players get banned/kicked from a chatoom whilst in another screen ([#1841](https://github.com/Ben987/Bondage-College/pull/1841))
* Ellie - Fixed an issue with the Deny and Edge vibrator modes not working in combination with some items ([#1842](https://github.com/Ben987/Bondage-College/pull/1842))
* Nina - Fixed the longstanding issue of tails not being visible in the hogtied/all fours poses ([#1847](https://github.com/Ben987/Bondage-College/pull/1847), [#1868](https://github.com/Ben987/Bondage-College/pull/1868), [#1878](https://github.com/Ben987/Bondage-College/pull/1878))
* Jomshir - Fixed an issue where disconnects would sometimes result in the relog screen not working properly ([#1856](https://github.com/Ben987/Bondage-College/pull/1856))
* Nina - Fixed a bug where the photography studio NPC wouldn't pose correctly when telling her to relax her arms ([#1858](https://github.com/Ben987/Bondage-College/pull/1858))
* Nina - Fixed an error at the end of the stable exam ([#1864](https://github.com/Ben987/Bondage-College/pull/1864))
* Nina - Fixed some visual issues with the Magic Show's Water Torture Cell ([#1866](https://github.com/Ben987/Bondage-College/pull/1866))
* Nina - Fixed some missing text in the Halloween Monster and Familiar sets ([#1867](https://github.com/Ben987/Bondage-College/pull/1867))
* Nina - Fixed an exploit that allowed players to circumvent OOC being blocked ([#1900](https://github.com/Ben987/Bondage-College/pull/1900))
* Nina - Fixed an issue where players could sometimes not access the College despite wearing the correct clothes ([#1921](https://github.com/Ben987/Bondage-College/pull/1921))

### [Technical]

* Sandrine - Added a major performance enhancement to extended item screens ([#1511](https://github.com/Ben987/Bondage-College/pull/1511))
* Nina - Reworked the game's height system, allowing the creation of items that extend outside the character canvas. This will enable the creation of several exciting new items and features in this release and future releases ([#1844](https://github.com/Ben987/Bondage-College/pull/1844))
* Lots of technical changes, fixes and improvements:
    * Ellie - [#1798](https://github.com/Ben987/Bondage-College/pull/1798), [#1813](https://github.com/Ben987/Bondage-College/pull/1813), [#1821](https://github.com/Ben987/Bondage-College/pull/1821), [#1823](https://github.com/Ben987/Bondage-College/pull/1823), [#1830](https://github.com/Ben987/Bondage-College/pull/1830), [#1827](https://github.com/Ben987/Bondage-College/pull/1827), [#1854](https://github.com/Ben987/Bondage-College/pull/1854), [#1855](https://github.com/Ben987/Bondage-College/pull/1855)
    * Ada - [#1812](https://github.com/Ben987/Bondage-College/pull/1812), [#1790](https://github.com/Ben987/Bondage-College/pull/1790)
    * Sandrine - [#1818](https://github.com/Ben987/Bondage-College/pull/1818)
    * Rui - [#1822](https://github.com/Ben987/Bondage-College/pull/1822)
    * Nina - [#1825](https://github.com/Ben987/Bondage-College/pull/1825), [#1840](https://github.com/Ben987/Bondage-College/pull/1840), [#1845](https://github.com/Ben987/Bondage-College/pull/1845), [#1865](https://github.com/Ben987/Bondage-College/pull/1865)
    * Ace - [#1791](https://github.com/Ben987/Bondage-College/pull/1791)
    * tickler2000 - [#1850](https://github.com/Ben987/Bondage-College/pull/1850)

### [Beta Fixes]

* Ellie - [#1870](https://github.com/Ben987/Bondage-College/pull/1870), [#1871](https://github.com/Ben987/Bondage-College/pull/1871), [#1872](https://github.com/Ben987/Bondage-College/pull/1872), [#1882](https://github.com/Ben987/Bondage-College/pull/1882), [#1886](https://github.com/Ben987/Bondage-College/pull/1886), [#1897](https://github.com/Ben987/Bondage-College/pull/1897), [#1898](https://github.com/Ben987/Bondage-College/pull/1898), [#1901](https://github.com/Ben987/Bondage-College/pull/1901), [#1905](https://github.com/Ben987/Bondage-College/pull/1905), [#1906](https://github.com/Ben987/Bondage-College/pull/1906), [#1907](https://github.com/Ben987/Bondage-College/pull/1907), [#1919](https://github.com/Ben987/Bondage-College/pull/1919), [#1920](https://github.com/Ben987/Bondage-College/pull/1920), [#1924](https://github.com/Ben987/Bondage-College/pull/1924), [#1934](https://github.com/Ben987/Bondage-College/pull/1934), [#1937](https://github.com/Ben987/Bondage-College/pull/1937), [#1938](https://github.com/Ben987/Bondage-College/pull/1938), [#1939](https://github.com/Ben987/Bondage-College/pull/1939), [#1942](https://github.com/Ben987/Bondage-College/pull/1942)
* Ada - [#1874](https://github.com/Ben987/Bondage-College/pull/1874), [#1875](https://github.com/Ben987/Bondage-College/pull/1875), [#1876](https://github.com/Ben987/Bondage-College/pull/1876), [#1877](https://github.com/Ben987/Bondage-College/pull/1877), [#1880](https://github.com/Ben987/Bondage-College/pull/1880), [#1887](https://github.com/Ben987/Bondage-College/pull/1887), [#1902](https://github.com/Ben987/Bondage-College/pull/1902), [#1917](https://github.com/Ben987/Bondage-College/pull/1917), [#1927](https://github.com/Ben987/Bondage-College/pull/1927), [#1946](https://github.com/Ben987/Bondage-College/pull/1946), [#1950](https://github.com/Ben987/Bondage-College/pull/1950)
* Nina - [#1878](https://github.com/Ben987/Bondage-College/pull/1878), [#1879](https://github.com/Ben987/Bondage-College/pull/1879), [#1881](https://github.com/Ben987/Bondage-College/pull/1881), [#1883](https://github.com/Ben987/Bondage-College/pull/1883), [#1892](https://github.com/Ben987/Bondage-College/pull/1892), [#1894](https://github.com/Ben987/Bondage-College/pull/1894), [#1900](https://github.com/Ben987/Bondage-College/pull/1900), [#1912](https://github.com/Ben987/Bondage-College/pull/1912), [#1921](https://github.com/Ben987/Bondage-College/pull/1921), [#1944](https://github.com/Ben987/Bondage-College/pull/1944), [#1941](https://github.com/Ben987/Bondage-College/pull/1941)
* Jomshir - [#1889](https://github.com/Ben987/Bondage-College/pull/1889)
* Sandrine - [#1933](https://github.com/Ben987/Bondage-College/pull/1933)

## [R63]

### [Added]

* Verity/Nina - Added new Rope/Gag/Lock emoticons ([#1679](https://github.com/Ben987/Bondage-College/pull/1679))
* Ada - Added the option to open the front of the Futuristic Chastity Belt ([#1682](https://github.com/Ben987/Bondage-College/pull/1682))
* wildsj - Added multi-color support to the Puffy Dress ([#1678](https://github.com/Ben987/Bondage-College/pull/1678))
* Jomshir - Reworked the facial expression menu to make selecting facial expressions easier ([#1683](https://github.com/Ben987/Bondage-College/pull/1683))
* Sandrine - Added multi-color support to the Bit Gag ([#1697](https://github.com/Ben987/Bondage-College/pull/1697))
* Ada - Several improvements to the Futuristic Panel Gag ([#1687](https://github.com/Ben987/Bondage-College/pull/1687), [#1689](https://github.com/Ben987/Bondage-College/pull/1689)): 
    * It now deflates one level at a time instead of all at once
    * Players can now change the deflation timer on the gag
    * Players can now manually pump the gag up by one inflation level
* Emily R - Added multi-color support to the Chinese Long dress and the Boots items ([#1699](https://github.com/Ben987/Bondage-College/pull/1699), [#1728](https://github.com/Ben987/Bondage-College/pull/1728))
* Ben - Added multiple difficulty modes that modify the multiplayer experience with varying degrees of strictness
    * Difficulty can be changed from the new "Difficulty" player preference screen
* Ada - Added a function to the Futuristic Collar to allow it to copy its colors to other worn futuristic items ([#1662](https://github.com/Ben987/Bondage-College/pull/1662))
* Sandrine - Added a dimming effect to chatrooms when a player has both of their eyes closed ([#1702](https://github.com/Ben987/Bondage-College/pull/1702))
* Evals/Ace - Added 2 new items ([#1703](https://github.com/Ben987/Bondage-College/pull/1703), [#1727](https://github.com/Ben987/Bondage-College/pull/1727))
    * Gwen Hood
    * Iron Cage Muzzle Gag
* Ada - Added the ability for players to be leashed into a different chatroom by friends when receiving a beep. This can be toggled on/off in the player's immersion preferences ([#1693](https://github.com/Ben987/Bondage-College/pull/1693))
* Jomshir - Reworked the friend list ([#1677](https://github.com/Ben987/Bondage-College/pull/1677))
    * Friends are now categorized by type, and offline friends will now be displayed
* Ben - Changed the friend list so that it now automatically refreshes every 30 seconds
* Emily R - Added 2 new items ([#1711](https://github.com/Ben987/Bondage-College/pull/1711), [#1734](https://github.com/Ben987/Bondage-College/pull/1734))
    * Heavy Latex Corset
    * Reindeer Hairband
* Aeren - Added a garterless option for the Latex Corset ([#1569](https://github.com/Ben987/Bondage-College/pull/1569))
* Ada - Added a 2 new items ([#1718](https://github.com/Ben987/Bondage-College/pull/1718), [#1715](https://github.com/Ben987/Bondage-College/pull/1715))
    * Pilot Panties
    * Futuristic Mittens
* Ada - Added an "Over Panties" option to the crotch rope ([#1716](https://github.com/Ben987/Bondage-College/pull/1716))
* Ada - Added a new Password Lock ([#1663](https://github.com/Ben987/Bondage-College/pull/1663))
    * Passwords can be up to 8 letters long, and the user can include a password hint
* Jomshir - Added an icon indicating when a player is a chatroom admin ([#1724](https://github.com/Ben987/Bondage-College/pull/1724))
* Ace - Added two new piercings - the Barbell Piercing and the Crossed Straight Piercing ([#1726](https://github.com/Ben987/Bondage-College/pull/1726))
* Gnarp - Added default colors to the bed and covers items ([#1729](https://github.com/Ben987/Bondage-College/pull/1729))
* Ada - The user of a Futuristic Collar can now allow other players to modify other futuristic items on the same player ([#1731](https://github.com/Ben987/Bondage-College/pull/1731))
* Ayesha - Added 2 new items ([#1732](https://github.com/Ben987/Bondage-College/pull/1732))
    * Barefoot Sandals
    * Left & Right Anklets
* Gnarp - Added multi-color support to the Rhinestone Sandals ([#1738](https://github.com/Ben987/Bondage-College/pull/1738))
* Ayesha - Added multi-color support to the nipple Taped Vibrating Eggs and the Latex Armbinder ([#1739](https://github.com/Ben987/Bondage-College/pull/1739))

### [Removed]

* Nothing this release

### [Changed]

* Ada - Changed the Futuristic Collar to now also lock itself when clicking "Lock" ([#1674](https://github.com/Ben987/Bondage-College/pull/1674))
* Ada - Changed whispers so that they are now blocked if you have disabled OOC when gagged ([#1671](https://github.com/Ben987/Bondage-College/pull/1671))
* Ada - Changed the password prompts on futuristic items to make them clearer ([#1686](https://github.com/Ben987/Bondage-College/pull/1686))
* Emily R - Modified the Snorkel to improve its positioning and coloring ([#1694](https://github.com/Ben987/Bondage-College/pull/1694))
* Ada - Modified the way chatrooms are rendered when the player is blind and the "Disable examining people when blind" preference is selected ([#1691](https://github.com/Ben987/Bondage-College/pull/1691))
* Ada - Modified the Futuristic Chastity Belt to also trigger outside of chatrooms ([#1690](https://github.com/Ben987/Bondage-College/pull/1690))
* Ada - Changed the Futuristic Chastity Bra to allow it to display a higher maximum heartrate ([#1701](https://github.com/Ben987/Bondage-College/pull/1701))
* Sandrine - Changed the Nursery so that it now recognises the player as being diapered if they are wearing any diaper items, and not just the default Diaper ([#1704](https://github.com/Ben987/Bondage-College/pull/1704))
* Wultir - Removed the item zone grid from players when coloring an item ([#1708](https://github.com/Ben987/Bondage-College/pull/1708))
* Ada - Changed the player arousal indicator to disappear when arousal reaches 0 ([#1712](https://github.com/Ben987/Bondage-College/pull/1712))
* Ada - Edited the Bolero Straitjacket and the Armbinder Jacket to improve coloring ([#1719](https://github.com/Ben987/Bondage-College/pull/1719))
* Wultir - Changed the Maid Quarters so that players can now do maid work in the exposed version of the maid outfit ([#1714](https://github.com/Ben987/Bondage-College/pull/1714))
* Ace - Changed posture collar items to block the nod/wiggle activities on the head ([#1794](https://github.com/Ben987/Bondage-College/pull/1794))

### [Fixed]

* Nina - Fixed a bug where players could no longer access the College, even with the correct uniform ([#1676](https://github.com/Ben987/Bondage-College/pull/1676))
* Ada - Fixed an issue with chatroom messages from the Automatic Shock Collar/Unit and Futuristic Panel Gag getting filtered by the automatic message filter ([#1680](https://github.com/Ben987/Bondage-College/pull/1680))
* Ada - Changed the Automatic Shock Collar and Futuristic Panel Gag to not get triggered by whispers ([#1681](https://github.com/Ben987/Bondage-College/pull/1681))
* Ada - Fixed an issue where the lock icon for the Futuristic Ankle Cuffs would be positioned incorrectly in the spread eagle pose ([#1685](https://github.com/Ben987/Bondage-College/pull/1685))
* Wultir - Fixed an issue causing activities to not show up under certain circumstances ([#1696](https://github.com/Ben987/Bondage-College/pull/1696))
* Ada - Fixed a duplicate dialogue option for the main hall maid when wearing an owner-locked item ([#1695](https://github.com/Ben987/Bondage-College/pull/1695))
* Ada - Fixed an issue where the Futuristic Collar would allow players to add a Mistress Lock to someone without needing to own one ([#1707](https://github.com/Ben987/Bondage-College/pull/1707))
* Wultir - Fixed an issue where ignored chatrooms would not be displayed in the chatroom filter when they were not on the first page of chatrooms ([#1720](https://github.com/Ben987/Bondage-College/pull/1720))
* Ellie - Fixed a rare issue which would cause the player to not be visible after entering a chatroom after relogging ([#1723](https://github.com/Ben987/Bondage-College/pull/1723))
* Ellie - Fixed a potential exploit where console users could crash other players' games ([#1733](https://github.com/Ben987/Bondage-College/pull/1733))
* Wultir - Fixed an error with the Shock Collar/Unit when the players shock themselves ([#1736](https://github.com/Ben987/Bondage-College/pull/1736))

### [Technical]

* Minor technical changes, fixes and improvements:
    * Ada - [#1684](https://github.com/Ben987/Bondage-College/pull/1684), [#1700](https://github.com/Ben987/Bondage-College/pull/1700), [#1705](https://github.com/Ben987/Bondage-College/pull/1705), [#1709](https://github.com/Ben987/Bondage-College/pull/1709), [#1710](https://github.com/Ben987/Bondage-College/pull/1710), [#1717](https://github.com/Ben987/Bondage-College/pull/1717), [#1722](https://github.com/Ben987/Bondage-College/pull/1722), [#1725](https://github.com/Ben987/Bondage-College/pull/1725), [#1730](https://github.com/Ben987/Bondage-College/pull/1730)
    * Sandrine - [#1706](https://github.com/Ben987/Bondage-College/pull/1706)
    * Wultir - [#1721](https://github.com/Ben987/Bondage-College/pull/1721)
    * Ace - [#1737](https://github.com/Ben987/Bondage-College/pull/1737)

### [Beta Fixes]

* Ace - [#1741](https://github.com/Ben987/Bondage-College/pull/1741), [#1745](https://github.com/Ben987/Bondage-College/pull/1745), [#1754](https://github.com/Ben987/Bondage-College/pull/1754), [#1759](https://github.com/Ben987/Bondage-College/pull/1759), [#1763](https://github.com/Ben987/Bondage-College/pull/1763), [#1765](https://github.com/Ben987/Bondage-College/pull/1765), [#1768](https://github.com/Ben987/Bondage-College/pull/1768), [#1769](https://github.com/Ben987/Bondage-College/pull/1769), [#1771](https://github.com/Ben987/Bondage-College/pull/1771), [#1767](https://github.com/Ben987/Bondage-College/pull/1767), [#1774](https://github.com/Ben987/Bondage-College/pull/1774), [#1779](https://github.com/Ben987/Bondage-College/pull/1779), [#1787](https://github.com/Ben987/Bondage-College/pull/1787), [#1803](https://github.com/Ben987/Bondage-College/pull/1803)
* Ada - [#1742](https://github.com/Ben987/Bondage-College/pull/1742), [#1744](https://github.com/Ben987/Bondage-College/pull/1744), [#1746](https://github.com/Ben987/Bondage-College/pull/1746), [#1747](https://github.com/Ben987/Bondage-College/pull/1747), [#1755](https://github.com/Ben987/Bondage-College/pull/1755), [#1760](https://github.com/Ben987/Bondage-College/pull/1760), [#1761](https://github.com/Ben987/Bondage-College/pull/1761), [#1802](https://github.com/Ben987/Bondage-College/pull/1802)
* Ellie - [#1749](https://github.com/Ben987/Bondage-College/pull/1749), [#1750](https://github.com/Ben987/Bondage-College/pull/1750), [#1753](https://github.com/Ben987/Bondage-College/pull/1753), [#1776](https://github.com/Ben987/Bondage-College/pull/1776), [#1781](https://github.com/Ben987/Bondage-College/pull/1781), [#1783](https://github.com/Ben987/Bondage-College/pull/1783)
* Emily R - [#1780](https://github.com/Ben987/Bondage-College/pull/1780)
* Jomshir - [#1748](https://github.com/Ben987/Bondage-College/pull/1748), [#1793](https://github.com/Ben987/Bondage-College/pull/1793)
* Nina - [#1751](https://github.com/Ben987/Bondage-College/pull/1751), [#1766](https://github.com/Ben987/Bondage-College/pull/1766), [#1770](https://github.com/Ben987/Bondage-College/pull/1770), [#1775](https://github.com/Ben987/Bondage-College/pull/1775), [#1777](https://github.com/Ben987/Bondage-College/pull/1777), [#1782](https://github.com/Ben987/Bondage-College/pull/1782)
* Wultir - [#1762](https://github.com/Ben987/Bondage-College/pull/1762), [#1785](https://github.com/Ben987/Bondage-College/pull/1785)

## [R62]

### [Added]
* Ada - Added several new items ([#1582](https://github.com/Ben987/Bondage-College/pull/1582), [#1588](https://github.com/Ben987/Bondage-College/pull/1588), [#1592](https://github.com/Ben987/Bondage-College/pull/1592), [#1589](https://github.com/Ben987/Bondage-College/pull/1589), [#1600](https://github.com/Ben987/Bondage-College/pull/1600), [#1608](https://github.com/Ben987/Bondage-College/pull/1608))
    * A new Pilot Suit
    * An Automatic Shock Collar and Automatic Shock Unit
    * New Futuristic Heels, Collar, Armbinder, Arm/Leg/Ankle Cuffs
* Ben - Added the ability to block item categories from rooms
* Victor Reed - Added a new Cryogenic Capsule item ([#1553](https://github.com/Ben987/Bondage-College/pull/1553))
* Emily R - Added several new items ([#1556](https://github.com/Ben987/Bondage-College/pull/1556), [#1640](https://github.com/Ben987/Bondage-College/pull/1640))
    * A Foam Sword handheld toy
    * New Latex Elbow Gloves
    * A new Open Face Hood item
* Ace - Added the variants of the Cow Tail and Bunny Tail items to the tail strap slot ([#1549](https://github.com/Ben987/Bondage-College/pull/1549))
* Ace - Added new import/export color buttons to the color picker to allow players to copy/paste color codes (feature may not be available in some older browsers) ([#1550](https://github.com/Ben987/Bondage-College/pull/1550))
* Wultir - Added the new vibrator modes to the taped clit & nipple eggs ([#1597](https://github.com/Ben987/Bondage-College/pull/1597))
* Ada - Added several new activities ([#1598](https://github.com/Ben987/Bondage-College/pull/1598), [#1628](https://github.com/Ben987/Bondage-College/pull/1628))
    * Moan/Whimper/Shout/Groan/Talk into Gag
    * Kiss on Gag
    * Wiggle
    * Nod
    * Sit
    * Struggle
* Nina - Overhauled the main player preferences page ([#1599](https://github.com/Ben987/Bondage-College/pull/1599))
* Ada - Added a "Request maid service" button to the main hall. The feature can be turned on in your General preferences ([#1564](https://github.com/Ben987/Bondage-College/pull/1564), [#1606](https://github.com/Ben987/Bondage-College/pull/1606))
* Ben - Added a leveling system to LARP, along with the ability to set longer turn timers
* Ada - Added the ability to temporarily suspend the main hall maid (available from the Maid Quarters) ([#1530](https://github.com/Ben987/Bondage-College/pull/1530))
* Ada - Added a new graphical indicator for when a character is being vibed - can be changed or turned off in Graphical preferences ([#1559](https://github.com/Ben987/Bondage-College/pull/1559))
* Ada - Added new Immersion preferences ([#1627](https://github.com/Ben987/Bondage-College/pull/1627))
    * A preference to prevent OOC chat when gagged
    * A preference to lock the Immersion preferences screen when the player is bound
    * A new "Total (no whispers)" sensory deprivation setting
* jomshir98 - Added a new "Light" sensory deprivation setting where player names will be visible and the blindfolds/hoods will never completely black out the screen ([#1635](https://github.com/Ben987/Bondage-College/pull/1635))
* Emily R/Nina - Added a new GP-9 Gas Mask item ([#1638](https://github.com/Ben987/Bondage-College/pull/1638), [#1639](https://github.com/Ben987/Bondage-College/pull/1639))
* Ben - Added some more story paths to the Movie Studio
* Emily R - Added a new latex room chatroom background, available in both normal chatrooms and the Asylum ([#1640](https://github.com/Ben987/Bondage-College/pull/1640))
* Nina - Added multi-color support to the Striped Socks and the College Uniform ([#1644](https://github.com/Ben987/Bondage-College/pull/1644), [#1643](https://github.com/Ben987/Bondage-College/pull/1643))
* Buizel - Added 21 new back hair styles ([#1660](https://github.com/Ben987/Bondage-College/pull/1660))

### [Removed]
* Ben - Removed the futuristic items from the random NPC pool
* Ben - Fixed an issue where players could not remove their NPC owner after auctioning themselves

### [Changed]
* Ada - Overhauled most of the futuristic items with several new features ([#1580](https://github.com/Ben987/Bondage-College/pull/1580), [#1586](https://github.com/Ben987/Bondage-College/pull/1586), [#1581](https://github.com/Ben987/Bondage-College/pull/1581), [#1604](https://github.com/Ben987/Bondage-College/pull/1604), [#1602](https://github.com/Ben987/Bondage-College/pull/1602), [#1607](https://github.com/Ben987/Bondage-College/pull/1607))
* Sandrine - Fixed and reworked difficulties on several gags for consistency ([#1590](https://github.com/Ben987/Bondage-College/pull/1590))
* Sandrine - Adjusted the difficulties on the Inflatable Strait Leotard. The maximum inflation level will now prevent players from leaving rooms ([#1570](https://github.com/Ben987/Bondage-College/pull/1570))
* Aeren - Renamed several dresses (these dresses will _not_ be filtered out by the ABDL filter)
    * Puffy Baby Dress -> Puffy Dress
    * Bows Baby Dress -> Bows Dress
    * Flower Baby Dress -> Summer flower dress
    * Shiny Baby Dress -> Shiny dress
* Nina - Changed the Open Hair Latex Hood to support multi-coloring (hair will default to the player's front hair color) ([#1613](https://github.com/Ben987/Bondage-College/pull/1613))
* Ayesha - Changed the vibrating dildo, Leather Choker and Leather Collar to support multi-coloring ([#1616](https://github.com/Ben987/Bondage-College/pull/1616), [#1622](https://github.com/Ben987/Bondage-College/pull/1622))
* Ben - Prevented players from manually equipping items when playing in a movie in the Movie Studio
* jomshir98 - Changed whispers to allow speech garbling ([#1620](https://github.com/Ben987/Bondage-College/pull/1620))
    * Added a new chat command `/ooc` to trigger OOC chat
    * Added chat preferences to trigger OOC chat with '(' and to automatically add '(' to the start of whispers
* Ben - LARP rooms will now show up in the regular chatroom search and rooms can be toggled between regular and LARP
* Ada - Moved some player preferences into a new Immersion preferences screen ([#1627](https://github.com/Ben987/Bondage-College/pull/1627)))

### [Fixed]
* Ada - Fixed an issue where the Interactive Visor prevented players from changing clothes whilst untinted ([#1583](https://github.com/Ben987/Bondage-College/pull/1583)) 
* Ellie - Fixed a bug where players were unable to change their skin color ([#1584](https://github.com/Ben987/Bondage-College/pull/1584))
* Ace - Fixed an issue that prevented players from kneeling when wearing the Concealing Cloak ([#1587](https://github.com/Ben987/Bondage-College/pull/1587))
* Ellie - Fixed some issues with gag effects on the Futuristic Panel Gags ([#1585](https://github.com/Ben987/Bondage-College/pull/1585))
* Ellie - Fixed an issue where the rope toe tie would play a lock sound when applied ([#1591](https://github.com/Ben987/Bondage-College/pull/1591))
* Victor Reed - Fixed an issue with the chatroom message for the Coffin [#1553](https://github.com/Ben987/Bondage-College/pull/1553)
* Ellie - Fixed an issue where typing certain colors into the color picker input would cause the color picker to crash ([#1603](https://github.com/Ben987/Bondage-College/pull/1603))
* Nina - Fixed an issue where helping someone to kneel wouldn't work under certain conditions ([#1609](https://github.com/Ben987/Bondage-College/pull/1609))
* Nina - Fixed an issue where chains would clip through the Strait Dress ([#1610](https://github.com/Ben987/Bondage-College/pull/1610))
* Nina - Fixed some visual issues with the Bolero Straitjacket ([#1611](https://github.com/Ben987/Bondage-College/pull/1611))
* Aeren/Rui - Fixed some visual issues with the Succubus Heart Tails ([#1612](https://github.com/Ben987/Bondage-College/pull/1612))
* Ben - Fixed some issues with LARP when players disconnect
* Nina - Fixed an issue where the handheld toys item would appear in the player's inventory, despite not owning any toys ([#1617](https://github.com/Ben987/Bondage-College/pull/1617))
* Nina - Changed the handheld toys so that both the player and target character's handheld toys are available to use ([#1604](https://github.com/Ben987/Bondage-College/pull/1604))
* Nina - Fixed an issue where vibrators set to "Edge" on certain zones would allow players to orgasm ([#1623](https://github.com/Ben987/Bondage-College/pull/1623))
* Nina - Fixed an issue with the Metal Leg Spreader and the Wooden leg cuffs when the target player was kneeling ([#1624](https://github.com/Ben987/Bondage-College/pull/1624))
* Ellie - Fixed an issue where changing the vibrator settings on the Mermaid Tail would cause its locks to fall off ([#1633](https://github.com/Ben987/Bondage-College/pull/1633))
* Nina - Fixed an issue where unlocking a gag would break the gag's speech garbling effect ([#1637](https://github.com/Ben987/Bondage-College/pull/1637))

### [Technical]
* Many technical changes, fixes and improvements:
    * Ellie - [#1591](https://github.com/Ben987/Bondage-College/pull/1591)
    * Ada - [#1593](https://github.com/Ben987/Bondage-College/pull/1593), [#1594](https://github.com/Ben987/Bondage-College/pull/1594), [#1596](https://github.com/Ben987/Bondage-College/pull/1596), [#1595](https://github.com/Ben987/Bondage-College/pull/1595), [#1631](https://github.com/Ben987/Bondage-College/pull/1631)
    * Nina - [#1613](https://github.com/Ben987/Bondage-College/pull/1613), [#1614](https://github.com/Ben987/Bondage-College/pull/1614), [#1615](https://github.com/Ben987/Bondage-College/pull/1615), [#1625](https://github.com/Ben987/Bondage-College/pull/1625), [#1634](https://github.com/Ben987/Bondage-College/pull/1634)
    * Sandrine - [#1449](https://github.com/Ben987/Bondage-College/pull/1449)

### [Beta fixes]

* Nina - [#1642](https://github.com/Ben987/Bondage-College/pull/1642), [#1649](https://github.com/Ben987/Bondage-College/pull/1649), [#1653](https://github.com/Ben987/Bondage-College/pull/1653), [#1655](https://github.com/Ben987/Bondage-College/pull/1655), [#1656](https://github.com/Ben987/Bondage-College/pull/1656), [#1658](https://github.com/Ben987/Bondage-College/pull/1658), [#1659](https://github.com/Ben987/Bondage-College/pull/1659), [#1665](https://github.com/Ben987/Bondage-College/pull/1665)
* Emily R - [#1646](https://github.com/Ben987/Bondage-College/pull/1646)
* Ellie - [#1647](https://github.com/Ben987/Bondage-College/pull/1647), [#1657](https://github.com/Ben987/Bondage-College/pull/1657), [#1664](https://github.com/Ben987/Bondage-College/pull/1664)
* jomshir98 - [#1648](https://github.com/Ben987/Bondage-College/pull/1648), [#1654](https://github.com/Ben987/Bondage-College/pull/1654)
* Ada - [#1650](https://github.com/Ben987/Bondage-College/pull/1650), [#1651](https://github.com/Ben987/Bondage-College/pull/1651), [#1652](https://github.com/Ben987/Bondage-College/pull/1652), [#1661](https://github.com/Ben987/Bondage-College/pull/1661)

## [R61]

### [Added]
* Ace - New custom collar tag ([#1324](https://github.com/Ben987/Bondage-College/pull/1324), [#1478](https://github.com/Ben987/Bondage-College/pull/1478))
* Ace - The key and lock necklaces can now be worn over clothes or tucked in via the 👆 icon in the wardrobe ([#1294](https://github.com/Ben987/Bondage-College/pull/1294))
* Ruu/Poi - 15 new room backgrounds ([#1383](https://github.com/Ben987/Bondage-College/pull/1383))
* Ellie - 5 new advanced vibrator modes on several vibrators ([#1327](https://github.com/Ben987/Bondage-College/pull/1327))
    *  New chat preference to hide automated messages that don't involve you in chatrooms (from automatic vibrator updates)
* Ellie - Added a blinking light to the shock collar ([#1325](https://github.com/Ben987/Bondage-College/pull/1325))
* Rui - Added several new items ([#1373](https://github.com/Ben987/Bondage-College/pull/1373), [#1445](https://github.com/Ben987/Bondage-College/pull/1445))
    * A new leather bolero clothing item
    * A new studded harness item, available in both the torso item and bra slots
* Ace - Made a version of the leather corset top available in the bra slot ([#1373](https://github.com/Ben987/Bondage-College/pull/1373), [#1445](https://github.com/Ben987/Bondage-College/pull/1445))
* Ace - Added the ability to view locked wardrobe groups (so you can view other peoples' hair etc. in a read-only mode) ([#1362](https://github.com/Ben987/Bondage-College/pull/1362))
* gatetrek - Added several new assets ([#1366](https://github.com/Ben987/Bondage-College/pull/1366), [#1426](https://github.com/Ben987/Bondage-College/pull/1426))
    * A pair of jean shorts
    * Cow print bra, panties, socks, gloves, and cow ears
    * A new cow tail butt plug
    * A pleated skirt
    * 2 new front hairstyles
    * A new set of eyes
    * 2 new tags for the oval collar tag
* Amiciaderune - Added the ability to edit the colour of blush, emoticons and fluids from the wardrobe ([#1311](https://github.com/Ben987/Bondage-College/pull/1311))
* Ace - Added a new pose menu to allow players to change their pose without needing restraints ([#1336](https://github.com/Ben987/Bondage-College/pull/1336))
* Ace - Added the ability for players to view their current owner rules ([#1336](https://github.com/Ben987/Bondage-College/pull/1336))
* Nina - Added a new "Randomize clothes" button to the wardrobe to allow players to randomize only their clothing ([#1331](https://github.com/Ben987/Bondage-College/pull/1331))
* ZFreak, Sandrine - Added several new items ([#1378](https://github.com/Ben987/Bondage-College/pull/1378))
    * A mermaid tail item (with built in vibrator)
    * A clam shell bra
    * A snorkel mask
* Gnarp - Added several new items ([#1427](https://github.com/Ben987/Bondage-College/pull/1427), [#1471](https://github.com/Ben987/Bondage-College/pull/1471), [#1509](https://github.com/Ben987/Bondage-College/pull/1509))
    * A pair of Rhinestone Sandals
    * Long and short leggings, with multi-colour support
    * Sets of wooden cuffs for the wrists and ankles
* Ben - Added the ability for player subs to turn the tables on their NPC owner
* Ayesha - Added 2 new handheld items ([#1433](https://github.com/Ben987/Bondage-College/pull/1433), [#1446](https://github.com/Ben987/Bondage-College/pull/1446))
    * A shock wand
    * A lotion bottle
* Ben - Added the ability for a player's NPC subs to turn the tables and enslave the player if they aren't already owned
* Ellie - Added a new multi-coloring screen to allow players to apply multiple colors to items where supported ([#1368](https://github.com/Ben987/Bondage-College/pull/1368))
* Ayesha, Ellie, Nina - Migrated many existing items to make use of the multi-coloring system ([#1392](https://github.com/Ben987/Bondage-College/pull/1392), [#1505](https://github.com/Ben987/Bondage-College/pull/1505), [#1518](https://github.com/Ben987/Bondage-College/pull/1518))
    * [Full list of items that support multi-colouring](https://gist.github.com/elliesec/76eabcb4c79f937a7ca182a35f4394b9)
* Ace - Added the option for owners to remove the slave collar from their subs ([#1333](https://github.com/Ben987/Bondage-College/pull/1333))
* Ace - Added more fine-grained permissions to the wardrobe ([#1399](https://github.com/Ben987/Bondage-College/pull/1399))
    * Added an online preference to allow other players to change your whole appearance
    * Added an online preference to prevent other players from changing or removing cosplay items (ears, tail, wings)
* Nina - Added a new multi-color button to indicate when an item supports multi-coloring ([#1447](https://github.com/Ben987/Bondage-College/pull/1447))
* Sekkmer - Added a chatroom preference to preserve whitespace in chat ([#1459](https://github.com/Ben987/Bondage-College/pull/1459))
    * You can now use Shift + Enter in the chat box to send multi-line chat messages
* Ace - Added a permission system for extended items ([#1465](https://github.com/Ben987/Bondage-College/pull/1465))
    * Individual item type permissions can be set for most extended items in the game - not supported by all items yet
* Ellie - Added a new chatroom preference for coloring activities in the chat ([#1486](https://github.com/Ben987/Bondage-College/pull/1486))
* Ace - Added lots of French translations ([#1488](https://github.com/Ben987/Bondage-College/pull/1488))
* ZFreak - Added a new Inflatable Strait Leotard restraint ([#1342](https://github.com/Ben987/Bondage-College/pull/1342))
* Emily - Added 5 new chatroom backgrounds ([#1513](https://github.com/Ben987/Bondage-College/pull/1513), [#1533](https://github.com/Ben987/Bondage-College/pull/1533))
* Ben - Added the new Movie Studio room
* Emily - Added several new items ([#1517](https://github.com/Ben987/Bondage-College/pull/1517), [#1533](https://github.com/Ben987/Bondage-College/pull/1533))
    * A pair of clear sunglasses
    * A futuristic visor
    * Two bondage bustiers
    * A cape
    * A new pair of latex panties
* Ace - Added confirmation text for enabling/disabling your safeword ([#1522](https://github.com/Ben987/Bondage-College/pull/1522))
* Ada - Added several new items ([#1520](https://github.com/Ben987/Bondage-College/pull/1520), [#1526](https://github.com/Ben987/Bondage-College/pull/1526), [#1532](https://github.com/Ben987/Bondage-College/pull/1532), [#1534](https://github.com/Ben987/Bondage-College/pull/1534), [#1535](https://github.com/Ben987/Bondage-College/pull/1535))
    * A futuristic panel gag
    * A leather strap body harness
    * An interactive version of Emily's futuristic visor
    * A futuristic chastity belt & chastity bra
* Victor Reed - Added several new Halloween-themed items and background ([#1454](https://github.com/Ben987/Bondage-College/pull/1454))
* Ellie - Added this changelog ([#1473](https://github.com/Ben987/Bondage-College/pull/1473))!
* Ace, Gnarp - Added a new wooden sign item with customisable text ([#1477](https://github.com/Ben987/Bondage-College/pull/1477))
* Nina - Added a ruler to the handheld toys ([#1497](https://github.com/Ben987/Bondage-College/pull/1497))
    
### [Removed]
* Rui - Removed the deafness effect from the Pony Hood ([#1377](https://github.com/Ben987/Bondage-College/pull/1377))

### [Changed]
* Rui - Reduced the severity of the blindness effect on the Pony Hood ([#1377](https://github.com/Ben987/Bondage-College/pull/1377))
* Nina - Improvements to the extended item screen layout ([#1388](https://github.com/Ben987/Bondage-College/pull/1388))
* Ellie - Split the Chat Preferences into a Chat Preferences page, and an Online Preferences page ([#1327](https://github.com/Ben987/Bondage-College/pull/1327))
* Sandrine - Changed NPCs so that they will respect the player's preferences when removing cosplay items ([#1332](https://github.com/Ben987/Bondage-College/pull/1332))
* Aeren - Change the seamless suits to expose the same slots as their zipped counterparts ([#1475](https://github.com/Ben987/Bondage-College/pull/1475))
* Gnarp, Ayesha - Updated the bed with new and improved assets ([#1464](https://github.com/Ben987/Bondage-College/pull/1464))

### [Fixed]
* Ace - Fix for the red currently worn indicator in the wardrobe not updating ([#1291](https://github.com/Ben987/Bondage-College/pull/1291))
* Ace - Fix for incorrect hitboxes in the Asylum therapy game ([#1363](https://github.com/Ben987/Bondage-College/pull/1363))
* Ace - Fix to lock validation on NPCs ([#1380](https://github.com/Ben987/Bondage-College/pull/1380))
* Rui - Fix for incorrect fetish on the pencil skirt ([#1377](https://github.com/Ben987/Bondage-College/pull/1377)) 
* Ace - Fix for an incorrect chatroom message on the Old Gas Mask ([#1381](https://github.com/Ben987/Bondage-College/pull/1381))
* Ace - Fix for rooms with a member count over their size limit not showing up as greyed out ([#1428](https://github.com/Ben987/Bondage-College/pull/1428))
* Ace - Fixed an issue where character refreshes would boot the player out of the lock inventory screen ([#1411](https://github.com/Ben987/Bondage-College/pull/1411))
* Ace - Fix for text overflowing the boundaries of a chat message ([#1437](https://github.com/Ben987/Bondage-College/pull/1437))
* Ace - Fixed several issues in the club management screen around collar changing ([#1364](https://github.com/Ben987/Bondage-College/pull/1364))
* Ace - Fix for "ghost legs" when wearing catsuits ([#1419](https://github.com/Ben987/Bondage-College/pull/1419))
* Ellie - Fixed a bug where Bondage College NPCs would have random head colors ([#1448](https://github.com/Ben987/Bondage-College/pull/1448))
* Wultir - Fixed an issue where the nursery nurse would not correctly equip mittens on the player ([#1450](https://github.com/Ben987/Bondage-College/pull/1450))
* Wultir - Fixed an error occurring when talking to the cafe maid without a tray while on the drink serving job ([#1451](https://github.com/Ben987/Bondage-College/pull/1451))
* Sekkmer - Fix for `<` and `>` characters appearing in chat as `&gt` and `&lt` when the character stutters ([#1458](https://github.com/Ben987/Bondage-College/pull/1458))
* Nina - Fixed an issue where some NPCs would not randomise correctly ([#1468](https://github.com/Ben987/Bondage-College/pull/1468))
* Ben - Fixed an issue where the player would automatically redress on exiting the kidnappers league, even if unable to change
* Ace - Fixed an issue where ring, spider and lips gags would cause the player's mouth to disappear in mouth slots 2 & 3 ([#1496](https://github.com/Ben987/Bondage-College/pull/1496))
* Ellie - Fixed an issue where the chat activities would not regain color after leaving sensory deprivation ([#1486](https://github.com/Ben987/Bondage-College/pull/1486))
* Ace - Fixed an issue where dildo spreader bars would allow the character to kneel ([#1500](https://github.com/Ben987/Bondage-College/pull/1500))
* Nina - Fixed several issues with gag layering logic ([#1379](https://github.com/Ben987/Bondage-College/pull/1379))
* Ace - Fixed fetish controls being visible when sexual activities were disabled ([#1523](https://github.com/Ben987/Bondage-College/pull/1523))
* Ace - Fixed an issue where HTML form controls for some screens would not be removed when having an orgasm ([#1527](https://github.com/Ben987/Bondage-College/pull/1527))
* Ace - Added missing assets for Hair Ribbon 2 in the suspension pose ([#1529](https://github.com/Ben987/Bondage-College/pull/1529))
* Ada - Prevented random kidnappers from removing lover-locked items ([#1531](https://github.com/Ben987/Bondage-College/pull/1531))
* Ace - Fix for online maid drinks mission softlocked when the dray was lost ([#1568](https://github.com/Ben987/Bondage-College/pull/1568))
* Ace - Fix for the chatroom search pages not resetting when doing a new search ([#1566](https://github.com/Ben987/Bondage-College/pull/1566))
* Nina - Fix for the list of friends being drawn in the wrong position for rooms in the last row ([#1558](https://github.com/Ben987/Bondage-College/pull/1558))
* Wultir - Fix for the afk emote not always being set as expected ([#1557](https://github.com/Ben987/Bondage-College/pull/1557))

### [Technical]
* Ace - New dynamic asset framework ([#1324](https://github.com/Ben987/Bondage-College/pull/1324))
    * New online preference to disable dynamic assets on others (should assist users on slower machines)
* Sekkmer - Removed the `ItemHidden` asset group ([#1355](https://github.com/Ben987/Bondage-College/pull/1355))
* Ace - Rework of the game's audio system ([#1346](https://github.com/Ben987/Bondage-College/pull/1346))
* Ace - Rework of the active pose system ([#1336](https://github.com/Ben987/Bondage-College/pull/1336))
* Nina - Improvements to asset randomisation functionality to better respect blocked/limited items where possible ([#1331](https://github.com/Ben987/Bondage-College/pull/1331))
* Ellie - Added support for item layers to be coloured individually ([#1368](https://github.com/Ben987/Bondage-College/pull/1368))
* Ellie - Removed the `StraitDressOpen` and `Bolero` poses (now handled with advanced alpha masks) ([#1495](https://github.com/Ben987/Bondage-College/pull/1495))
* Many technical changes, fixes and improvements:
    * Nina - [#1371](https://github.com/Ben987/Bondage-College/pull/1371), [#1326](https://github.com/Ben987/Bondage-College/pull/1326), [#1415](https://github.com/Ben987/Bondage-College/pull/1415), [#1416](https://github.com/Ben987/Bondage-College/pull/1416), [#1463](https://github.com/Ben987/Bondage-College/pull/1463), [#1504](https://github.com/Ben987/Bondage-College/pull/1504), [#1493](https://github.com/Ben987/Bondage-College/pull/1493)
    * Sekkmer - [#1384](https://github.com/Ben987/Bondage-College/pull/1384), [#1385](https://github.com/Ben987/Bondage-College/pull/1385), [#1386](https://github.com/Ben987/Bondage-College/pull/1386), [#1460](https://github.com/Ben987/Bondage-College/pull/1460), [#1508](https://github.com/Ben987/Bondage-College/pull/1508)
    * Sandrine - [#1343](https://github.com/Ben987/Bondage-College/pull/1343), [#1370](https://github.com/Ben987/Bondage-College/pull/1370), [#1390](https://github.com/Ben987/Bondage-College/pull/1390), [#1408](https://github.com/Ben987/Bondage-College/pull/1408), [#1393](https://github.com/Ben987/Bondage-College/pull/1393), [#1409](https://github.com/Ben987/Bondage-College/pull/1409), [#1397](https://github.com/Ben987/Bondage-College/pull/1397), [#1391](https://github.com/Ben987/Bondage-College/pull/1391), [#1394](https://github.com/Ben987/Bondage-College/pull/1394), [#1407](https://github.com/Ben987/Bondage-College/pull/1407), [#1443](https://github.com/Ben987/Bondage-College/pull/1443), [#1436](https://github.com/Ben987/Bondage-College/pull/1436), [#1461](https://github.com/Ben987/Bondage-College/pull/1461), [#1438](https://github.com/Ben987/Bondage-College/pull/1438), [#1440](https://github.com/Ben987/Bondage-College/pull/1440), [#1439](https://github.com/Ben987/Bondage-College/pull/1439), [#1441](https://github.com/Ben987/Bondage-College/pull/1441), [#1442](https://github.com/Ben987/Bondage-College/pull/1442), [#1452](https://github.com/Ben987/Bondage-College/pull/1452), [#1453](https://github.com/Ben987/Bondage-College/pull/1453)
    * Ace - [#1367](https://github.com/Ben987/Bondage-College/pull/1367), [#1365](https://github.com/Ben987/Bondage-College/pull/1365), [#1351](https://github.com/Ben987/Bondage-College/pull/1351), [#1369](https://github.com/Ben987/Bondage-College/pull/1369), [#1374](https://github.com/Ben987/Bondage-College/pull/1374), [#1398](https://github.com/Ben987/Bondage-College/pull/1398), [#1362](https://github.com/Ben987/Bondage-College/pull/1362), [#1395](https://github.com/Ben987/Bondage-College/pull/1395), [#1396](https://github.com/Ben987/Bondage-College/pull/1396), [#1400](https://github.com/Ben987/Bondage-College/pull/1400), [#1410](https://github.com/Ben987/Bondage-College/pull/1410), [#1405](https://github.com/Ben987/Bondage-College/pull/1405), [#1403](https://github.com/Ben987/Bondage-College/pull/1403), [#1401](https://github.com/Ben987/Bondage-College/pull/1401), [#1429](https://github.com/Ben987/Bondage-College/pull/1429), [#1414](https://github.com/Ben987/Bondage-College/pull/1414), [#1402](https://github.com/Ben987/Bondage-College/pull/1402), [#1382](https://github.com/Ben987/Bondage-College/pull/1382), [#1425](https://github.com/Ben987/Bondage-College/pull/1425), [#1424](https://github.com/Ben987/Bondage-College/pull/1424), [#1423](https://github.com/Ben987/Bondage-College/pull/1423), [#1431](https://github.com/Ben987/Bondage-College/pull/1431), [#1404](https://github.com/Ben987/Bondage-College/pull/1404), [#1412](https://github.com/Ben987/Bondage-College/pull/1412), [#1413](https://github.com/Ben987/Bondage-College/pull/1413), [#1418](https://github.com/Ben987/Bondage-College/pull/1418), [#1420](https://github.com/Ben987/Bondage-College/pull/1420), [#1421](https://github.com/Ben987/Bondage-College/pull/1421), [#1422](https://github.com/Ben987/Bondage-College/pull/1422), [#1455](https://github.com/Ben987/Bondage-College/pull/1455), [#1456](https://github.com/Ben987/Bondage-College/pull/1456), [#1457](https://github.com/Ben987/Bondage-College/pull/1457), [#1430](https://github.com/Ben987/Bondage-College/pull/1430), [#1467](https://github.com/Ben987/Bondage-College/pull/1467), [#1417](https://github.com/Ben987/Bondage-College/pull/1417), [#1487](https://github.com/Ben987/Bondage-College/pull/1487), [#1469](https://github.com/Ben987/Bondage-College/pull/1469), [#1470](https://github.com/Ben987/Bondage-College/pull/1470), [#1491](https://github.com/Ben987/Bondage-College/pull/1491), [#1499](https://github.com/Ben987/Bondage-College/pull/1499), [#1466](https://github.com/Ben987/Bondage-College/pull/1466), [#1498](https://github.com/Ben987/Bondage-College/pull/1498), [#1503](https://github.com/Ben987/Bondage-College/pull/1503), [#1502](https://github.com/Ben987/Bondage-College/pull/1502), [#1501](https://github.com/Ben987/Bondage-College/pull/1501), [#1521](https://github.com/Ben987/Bondage-College/pull/1521)
    * Ellie - [#1389](https://github.com/Ben987/Bondage-College/pull/1389), [#1479](https://github.com/Ben987/Bondage-College/pull/1479), [#1490](https://github.com/Ben987/Bondage-College/pull/1490), [#1514](https://github.com/Ben987/Bondage-College/pull/1514)
    * Aeren - [#1510](https://github.com/Ben987/Bondage-College/pull/1510)

### [Beta fixes]
* Nina - [#1536](https://github.com/Ben987/Bondage-College/pull/1536),  [#1561](https://github.com/Ben987/Bondage-College/pull/1561),  [#1552](https://github.com/Ben987/Bondage-College/pull/1552),  [#1555](https://github.com/Ben987/Bondage-College/pull/1555),  [#1554](https://github.com/Ben987/Bondage-College/pull/1554)
* Ellie - [#1543](https://github.com/Ben987/Bondage-College/pull/1543),  [#1565](https://github.com/Ben987/Bondage-College/pull/1565),  [#1562](https://github.com/Ben987/Bondage-College/pull/1562),  [#1546](https://github.com/Ben987/Bondage-College/pull/1546), [#1578](https://github.com/Ben987/Bondage-College/pull/1578)
* Wultir - [#1551](https://github.com/Ben987/Bondage-College/pull/1551)
* Ace -  [#1538](https://github.com/Ben987/Bondage-College/pull/1538), [#1539](https://github.com/Ben987/Bondage-College/pull/1539),  [#1540](https://github.com/Ben987/Bondage-College/pull/1540),  [#1541](https://github.com/Ben987/Bondage-College/pull/1541),  [#1542](https://github.com/Ben987/Bondage-College/pull/1542),  [#1544](https://github.com/Ben987/Bondage-College/pull/1544),  [#1545](https://github.com/Ben987/Bondage-College/pull/1545),  [#1548](https://github.com/Ben987/Bondage-College/pull/1548),  [#1563](https://github.com/Ben987/Bondage-College/pull/1563),  [#1567](https://github.com/Ben987/Bondage-College/pull/1567),  [#1572](https://github.com/Ben987/Bondage-College/pull/1572), [#1579](https://github.com/Ben987/Bondage-College/pull/1579)
* Firefly - [#1575](https://github.com/Ben987/Bondage-College/pull/1575)
