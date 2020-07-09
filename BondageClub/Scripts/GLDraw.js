"use strict"

var GLDrawImageCache = new Map();

var GLDrawCacheLoadedImages = 0;
var GLDrawCacheTotalImages = 0;

var GLVersion;

var GLDrawCanvas;

var GLDrawAlphaThreshold = 0.01;
var GLDrawHalfAlphaLow = 0.8 / 256.0;
var GLDrawHalfAlphaHigh = 1.2 / 256.0;

window.addEventListener('load', GLDrawLoad);

// Load WebGL if not awailable it use the old canvas engine
function GLDrawLoad() {
    GLDrawCanvas = document.createElement("canvas");
    GLDrawCanvas.width = 1000;
    GLDrawCanvas.height = 1000;
    GLVersion = "webgl2";
    var gl = GLDrawCanvas.getContext(GLVersion);
    if (!gl) { GLVersion = "webgl"; gl = GLDrawCanvas.getContext(GLVersion); }
    if (!gl) { GLVersion = "No WebGL"; GLDrawCanvas.remove(); GLDrawCanvas = null; return; }

    GLDrawCanvas = GLDrawInitCharacterCanvas(GLDrawCanvas);

    CharacterAppearanceBuildCanvas = GLDrawAppearanceBuild;

    // Attach context listeners
    GLDrawCanvas.addEventListener("webglcontextlost", function (event) {
        event.preventDefault();
        console.log("WebGL Drawing disabled: Context Lost. If the context does not restore itself, refresh your page.");
    }, false);
    GLDrawCanvas.addEventListener("webglcontextrestored", function () {
        GLDrawLoad();
        console.log("WebGL: Context restored.");
    }, false);
    
    console.log("WebGL Drawing enabled: '" + GLVersion + "'");
}

// Makes all programs on the GL
function GLDrawMakeGLProgam(gl) {
    var vertexShader = GLDrawCreateShader(gl, GLDrawVertexShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = GLDrawCreateShader(gl, GLDrawFragmentShaderSource, gl.FRAGMENT_SHADER);
    var fragmentShaderFullAlpha = GLDrawCreateShader(gl, GLDrawFragmentShaderSourceFullAlpha, gl.FRAGMENT_SHADER);
    var fragmentShaderHalfAlpha = GLDrawCreateShader(gl, GLDrawFragmentShaderSourceHalfAlpha, gl.FRAGMENT_SHADER);

    gl.program = GLDrawCreateProgram(gl, vertexShader, fragmentShader);
    gl.programFull = GLDrawCreateProgram(gl, vertexShader, fragmentShaderFullAlpha);
    gl.programHalf = GLDrawCreateProgram(gl, vertexShader, fragmentShaderHalfAlpha);

    gl.programFull.u_color = gl.getUniformLocation(gl.programFull, "u_color");
    gl.programHalf.u_color = gl.getUniformLocation(gl.programHalf, "u_color");

    gl.textureCache = new Map();
}

// Initialize a WebGL canvas
function GLDrawInitCharacterCanvas(canvas) {
    if (canvas == null) {
        canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 1000;
    }
    if (canvas.GL == null) {
        canvas.GL = canvas.getContext(GLVersion);
        if (canvas.GL == null) {
            canvas.remove();
            return GLDrawInitCharacterCanvas(null);
        }
    } else {
        GLDrawClearRect(canvas.GL, 0, 0, 1000, 1000);
    }
    if (canvas.GL.program == null) {
        GLDrawMakeGLProgam(canvas.GL);
    }
    return canvas;
}

var GLDrawVertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;

  uniform mat4 u_matrix;

  varying vec2 v_texcoord;

  void main() {
     gl_Position = u_matrix * a_position;
     v_texcoord = a_texcoord;
  }
`;

var GLDrawFragmentShaderSource = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;

  void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    if (texColor.w < ` + GLDrawAlphaThreshold + `) discard;
    gl_FragColor = texColor;   
  }
`;

var GLDrawFragmentShaderSourceFullAlpha = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;
  uniform vec4 u_color;

  void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    if (texColor.w < ` + GLDrawAlphaThreshold + `) discard;
    float t = (texColor.x + texColor.y + texColor.z) / 383.0;
    gl_FragColor = u_color * vec4(t, t, t, texColor.w);
  }
`;

var GLDrawFragmentShaderSourceHalfAlpha = `
  precision mediump float;

  varying vec2 v_texcoord;

  uniform sampler2D u_texture;
  uniform vec4 u_color;

  void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    if (texColor.w < ` + GLDrawAlphaThreshold + `) discard;
    float t = (texColor.x + texColor.y + texColor.z) / 383.0;
    if (t < ` + GLDrawHalfAlphaLow + ` || t > ` + GLDrawHalfAlphaHigh + `) {
      gl_FragColor = texColor;
    } else {
      gl_FragColor = u_color * vec4(t, t, t, texColor.w);
    }
  }
`;

// Creates Shader from source
function GLDrawCreateShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw 'Could not compile WebGL program. \n\n' + gl.getShaderInfoLog(shader);
    }
    return shader;
}

// Creates Program from vertex and fragment shaders
function GLDrawCreateProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw 'Could not compile WebGL program. \n\n' + gl.getProgramInfoLog(program);
    }

    program.a_position = gl.getAttribLocation(program, "a_position");
    program.a_texcoord = gl.getAttribLocation(program, "a_texcoord");

    program.u_matrix = gl.getUniformLocation(program, "u_matrix");
    program.u_texture = gl.getUniformLocation(program, "u_texture");

    program.position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, program.position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,]), gl.STATIC_DRAW);

    program.texcoord_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, program.texcoord_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,]), gl.STATIC_DRAW);

    return program;
}

// Draws image from url to a WebGLRenderingContext
function GLDrawImageBlink(url, gl, dstX, dstY, color, fullAlpha) { GLDrawImage(url, gl, dstX + 500, dstY, color, fullAlpha); }
function GLDrawImage(url, gl, dstX, dstY, color, fullAlpha) {
    var tex = GLDrawLoadImage(gl, url);

    gl.bindTexture(gl.TEXTURE_2D, tex.texture);

    var program = (color == null) ? gl.program : (fullAlpha ? gl.programFull : gl.programHalf);

    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.DST_ALPHA);

    gl.bindBuffer(gl.ARRAY_BUFFER, program.position_buffer);
    gl.enableVertexAttribArray(program.a_position);
    gl.vertexAttribPointer(program.a_position, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, program.texcoord_buffer);
    gl.enableVertexAttribArray(program.a_texcoord);
    gl.vertexAttribPointer(program.a_texcoord, 2, gl.FLOAT, false, 0, 0);

    var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
    matrix = m4.translate(matrix, dstX, dstY, 0);
    matrix = m4.scale(matrix, tex.width, tex.height, 1);

    gl.uniformMatrix4fv(program.u_matrix, false, matrix);
    gl.uniform1i(program.u_texture, 0);
    if (program.u_color != null) gl.uniform4fv(program.u_color, GLDrawHexToRGBA(color));

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Sets texture info from image data
function GLDrawBingImageToTextureInfo(gl, Img, textureInfo) {
    textureInfo.width = Img.width;
    textureInfo.height = Img.height;
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Img);
}

// load Image texture data
function GLDrawLoadImage(gl, url) {

    var textureInfo = gl.textureCache.get(url);

    if (!textureInfo) {
        var tex = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, tex);
        textureInfo = { width: 1, height: 1, texture: tex, };
        gl.textureCache.set(url, textureInfo);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        var Img = GLDrawImageCache.get(url);

        if (Img) {
            GLDrawBingImageToTextureInfo(gl, Img, textureInfo);
        } else {
            Img = new Image();
            GLDrawImageCache.set(url, Img);

            ++GLDrawCacheTotalImages;
            Img.addEventListener('load', function () {
                GLDrawBingImageToTextureInfo(gl, Img, textureInfo);
                ++GLDrawCacheLoadedImages;
                if (GLDrawCacheLoadedImages == GLDrawCacheTotalImages) { Player.MustDraw = true; CharacterLoadCanvasAll(); }
            });
            Img.addEventListener('error', function () {
                if (Img.errorcount == null) Img.errorcount = 0;
                Img.errorcount += 1;
                if (Img.errorcount < 3) {
                    Img.src = Img.src;
                } else {
                    console.log("Error loading image " + Img.src);
                    ++GLDrawCacheLoadedImages;
                    if (GLDrawCacheLoadedImages == GLDrawCacheTotalImages) CharacterLoadCanvasAll();
                }
            });
            Img.src = url;
        }
    }
    return textureInfo;
}

// Clears rectangle on WebGLRenderingContext
function GLDrawClearRectBlink(gl, x, y, width, height) { GLDrawClearRect(gl, x + 500, y, width, height); }
function GLDrawClearRect(gl, x, y, width, height) {
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(x, y, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);
}

// Convert a hex color string to a RGBA color
function GLDrawHexToRGBA(color) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    color = color.replace(shorthandRegex, function (m, r, g, b) { return r + r + g + g + b + b; });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1] : [0, 0, 0, 1];
}

// Create character canvas with WebGL
function GLDrawAppearanceBuild(C) {
    GLDrawClearRect(GLDrawCanvas.GL, 0, 0, 1000, 1000);

    // Loops in all visible items worn by the character
    for (var A = 0; A < C.Appearance.length; A++)
        if (C.Appearance[A].Asset.Visible && CharacterAppearanceVisible(C, C.Appearance[A].Asset.Name, C.Appearance[A].Asset.Group.Name)) {

            // If there's a father group, we must add it to find the correct image
            var CA = C.Appearance[A];
            var ParentGroup = CA.Asset.ParentGroupName ? CA.Asset.ParentGroupName : CA.Asset.Group.ParentGroupName && !CA.Asset.IgnoreParentGroup ? CA.Asset.Group.ParentGroupName : "";
            var G = "";
            if (ParentGroup != "")
                for (var FG = 0; FG < C.Appearance.length; FG++)
                    if (ParentGroup == C.Appearance[FG].Asset.Group.Name)
                        G = "_" + C.Appearance[FG].Asset.Name;

            // If there's a pose style we must add (first by group then by item)
            var Pose = "";
            if ((CA.Asset.Group.AllowPose != null) && (CA.Asset.Group.AllowPose.length > 0) && (C.Pose != null) && (C.Pose.length > 0))
                for (var AP = 0; AP < CA.Asset.Group.AllowPose.length; AP++)
                    for (var P = 0; P < C.Pose.length; P++)
                        if (C.Pose[P] == CA.Asset.Group.AllowPose[AP])
                            Pose = C.Pose[P] + "/";
            if ((CA.Asset.AllowPose != null) && (CA.Asset.AllowPose.length > 0) && (C.Pose != null) && (C.Pose.length > 0))
                for (var AP = 0; AP < CA.Asset.AllowPose.length; AP++)
                    for (var P = 0; P < C.Pose.length; P++)
                        if (C.Pose[P] == CA.Asset.AllowPose[AP])
                            Pose = C.Pose[P] + "/";

            // If we must apply alpha masks to the current image as it is being drawn
            if (CA.Asset.Alpha != null)
                for (var AL = 0; AL < CA.Asset.Alpha.length; AL++) {
                    GLDrawClearRect(GLDrawCanvas.GL, CA.Asset.Alpha[AL][0], 1000 - CA.Asset.Alpha[AL][1] - CA.Asset.Alpha[AL][3], CA.Asset.Alpha[AL][2], CA.Asset.Alpha[AL][3]);
                    GLDrawClearRectBlink(GLDrawCanvas.GL, CA.Asset.Alpha[AL][0], 1000 - CA.Asset.Alpha[AL][1] - CA.Asset.Alpha[AL][3], CA.Asset.Alpha[AL][2], CA.Asset.Alpha[AL][3]);
                }

            // Check if we need to draw a different expression (for facial features)
            var Expression = "";
            if ((CA.Asset.Group.AllowExpression != null) && (CA.Asset.Group.AllowExpression.length > 0))
                if ((CA.Property && CA.Property.Expression && CA.Asset.Group.AllowExpression.indexOf(CA.Property.Expression) >= 0))
                    Expression = CA.Property.Expression + "/";

            // Find the X and Y position to draw on
            var X = CA.Asset.Group.DrawingLeft;
            var Y = CA.Asset.Group.DrawingTop;
            if (CA.Asset.DrawingLeft != null) X = CA.Asset.DrawingLeft;
            if (CA.Asset.DrawingTop != null) Y = CA.Asset.DrawingTop;
            if (C.Pose != null)
                for (var CP = 0; CP < C.Pose.length; CP++)
                    for (var P = 0; P < PoseFemale3DCG.length; P++)
                        if ((C.Pose[CP] == PoseFemale3DCG[P].Name) && (PoseFemale3DCG[P].MovePosition != null))
                            for (var M = 0; M < PoseFemale3DCG[P].MovePosition.length; M++)
                                if (PoseFemale3DCG[P].MovePosition[M].Group == CA.Asset.Group.Name) {
                                    X = X + PoseFemale3DCG[P].MovePosition[M].X;
                                    Y = Y + PoseFemale3DCG[P].MovePosition[M].Y;
                                }

            // Check if we need to draw a different variation (from type property)
            var Type = "";
            if ((CA.Property != null) && (CA.Property.Type != null)) Type = CA.Property.Type;

            // Cycle through all layers of the image
            var MaxLayer = (CA.Asset.Layer == null) ? 1 : CA.Asset.Layer.length;
            for (var L = 0; L < MaxLayer; L++) {
                var Layer = "";
                var LayerType = Type;
                if (CA.Asset.Layer != null) {
                    Layer = "_" + CA.Asset.Layer[L].Name;
                    if ((CA.Asset.Layer[L].AllowTypes != null) && (CA.Asset.Layer[L].AllowTypes.indexOf(Type) < 0)) continue;
                    if (!CA.Asset.Layer[L].HasExpression) Expression = "";
                    if (!CA.Asset.Layer[L].HasType) LayerType = "";
                    if ((CA.Asset.Layer[L].NewParentGroupName != null) && (CA.Asset.Layer[L].NewParentGroupName != CA.Asset.Group.ParentGroupName)) {
                        if (CA.Asset.Layer[L].NewParentGroupName == "") G = "";
                        else
                            for (var FG = 0; FG < C.Appearance.length; FG++)
                                if (CA.Asset.Layer[L].NewParentGroupName == C.Appearance[FG].Asset.Group.Name)
                                    G = "_" + C.Appearance[FG].Asset.Name;
                    }
                    if (CA.Asset.Layer[L].OverrideAllowPose != null) {
                        Pose = "";
                        for (var AP = 0; AP < CA.Asset.Layer[L].OverrideAllowPose.length; AP++)
                            for (var P = 0; P < C.Pose.length; P++)
                                if (C.Pose[P] == CA.Asset.Layer[L].OverrideAllowPose[AP])
                                    Pose = C.Pose[P] + "/";
                    }
                }

                // Draw the item on the canvas (default or empty means no special color, # means apply a color, regular text means we apply that text)
                if ((CA.Color != null) && (CA.Color.indexOf("#") == 0) && ((CA.Asset.Layer == null) || CA.Asset.Layer[L].AllowColorize)) {
                    GLDrawImage("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + Expression + CA.Asset.Name + G + LayerType + Layer + ".png", GLDrawCanvas.GL, X, Y, CA.Color, CA.Asset.Group.DrawingFullAlpha);
                    GLDrawImageBlink("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + (CA.Asset.Group.DrawingBlink ? "Closed/" : Expression) + CA.Asset.Name + G + LayerType + Layer + ".png", GLDrawCanvas.GL, X, Y, CA.Color, CA.Asset.Group.DrawingFullAlpha);
                } else {
                    var Color = ((CA.Color == null) || (CA.Color == "Default") || (CA.Color == "") || (CA.Color.length == 1) || (CA.Color.indexOf("#") == 0)) ? "" : "_" + CA.Color;
                    GLDrawImage("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + Expression + CA.Asset.Name + G + LayerType + Color + Layer + ".png", GLDrawCanvas.GL, X, Y);
                    GLDrawImageBlink("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + (CA.Asset.Group.DrawingBlink ? "Closed/" : Expression) + CA.Asset.Name + G + LayerType + Color + Layer + ".png", GLDrawCanvas.GL, X, Y);
                }
            }

            // If we must draw the lock (never colorized)
            if ((CA.Property != null) && (CA.Property.LockedBy != null) && (CA.Property.LockedBy != "")) {
                GLDrawImage("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + Expression + CA.Asset.Name + Type + "_Lock.png", GLDrawCanvas.GL, X, Y);
                GLDrawImageBlink("Assets/" + CA.Asset.Group.Family + "/" + CA.Asset.Group.Name + "/" + Pose + (CA.Asset.Group.DrawingBlink ? "Closed/" : Expression) + CA.Asset.Name + Type + "_Lock.png", GLDrawCanvas.GL, X, Y);
            }
        }

    if (C.Canvas == null) {
        C.Canvas = document.createElement("canvas");
        C.Canvas.width = 500;
        C.Canvas.height = 1000;
    } else C.Canvas.getContext("2d").clearRect(0, 0, 500, 1000);
    if (C.CanvasBlink == null) {
        C.CanvasBlink = document.createElement("canvas");
        C.CanvasBlink.width = 500;
        C.CanvasBlink.height = 1000;
    } else C.CanvasBlink.getContext("2d").clearRect(0, 0, 500, 1000);

    C.Canvas.getContext("2d").drawImage(GLDrawCanvas, 0, 0);
    C.CanvasBlink.getContext("2d").drawImage(GLDrawCanvas, -500, 0);

    C.MustDraw = true;
}
