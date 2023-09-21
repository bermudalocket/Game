#version 300 es

// functions
// genType = float, vec{2, 3, 4}
// genIType = int, ivec{2, 3, 4}
// genUType = uint, uvec{2, 3, 4}
// genBType = bool, bvec{2, 3, 4}

// 8.1 Angle and Trigonometry Functions
// genType radians(genType degrees)
// genType degrees(genType radians)
// genType sin(genType angle)
// genType cos(genType angle)
// genType tan(genType angle)
// genType asin(genType x)
// genType acos(genType x)
// genType atan(genType y, genType x)
// genType atan(genType y_over_x)
// genType sinh(genType angle)
// genType cosh(genType angle)
// genType tanh(genType angle)
// genType asinh(genType x)
// genType acosh(genType x)
// genType atanh(genType x)

// 8.2 Exponential Functions
// genType pow(genType x, genType y)
// genType exp(genType x)
// genType log(genType x)
// genType exp2(genType x)
// genType log2(genType x)
// genType sqrt(genType x)
// genType inversesqrt(genType x)

// 8.3 Common Functions
// genType abs(genType x)
// genType abs(genIType x)
// genType sign(genType x)
// genType sign(genIType x)
// genType floor(genType x)
// genType trunc(genType x)
// genType round(genType x)
// genType roundEven(genType x)
// genType ceil(genType x)
// genType fract(genType x)
// genType mod(genType x, float y)
// genType mod(genType x, genType y)
// genType modf(genType x, out genType i)

// genType min(genType x, genType y)
// genType min(genType x, float y)
// genType min(genIType x, genIType y)
// genType min(genIType x, int y)
// genType min(genUType x, genUType y)
// genType min(genUType x, uint y)

// genType max(genType x, genType y)
// genType max(genType x, float y)
// genType max(genIType x, genIType y)
// genType max(genIType x, int y)
// genType max(genUType x, genUType y)
// genType max(genUType x, uint y)

// genType clamp(genType x, genType minVal, genType maxVal)
// genType mix(genType x, genType y, genType a)
// genType step(genType edge, genType x)
// genType smoothstep(genType edge0, genType edge1, genType x)
// genType isnan(genType x)
// genType isinf(genType x)
// genType floatBitsToInt(genType x)
// genType floatBitsToUint(genType x)
// genType intBitsToFloat(genType x)
// genType uintBitsToFloat(genType x)
// genType fma(genType a, genType b, genType c)
// genType frexp(genType x, out genIType exp)
// genType ldexp(genType x, genIType exp)
// genType packUnorm2x16(genType v)
// genType packSnorm2x16(genType v)
// genType packUnorm4x8(genType v)
// genType packSnorm4x8(genType v)
// genType unpackUnorm2x16(genType v)
// genType unpackSnorm2x16(genType v)
// genType unpackUnorm4x8(genType v)
// genType unpackSnorm4x8(genType v)
// genType packDouble2x32(uvec2 v)
// uvec2 unpackDouble2x32(genType v)
// genType packHalf2x16(vec2 v)
// vec2 unpackHalf2x16(genType v)
// genType length(genType x)
// genType distance(genType p0, genType p1)
// genType dot(genType x, genType y)
// genType cross(genType x, genType y)
// genType normalize(genType x)
// genType faceforward(genType N, genType I, genType Nref)
// genType reflect(genType I, genType N)
// genType refract(genType I, genType N, genType eta)
// genType matrixCompMult(genType x, genType y)
// genType outerProduct(genType c, genType r)
// genType transpose(genType m)
// genType determinant(genType m)
// genType inverse(genType m)
// genType lessThan(genType x, genType y)
// genType lessThanEqual(genType x, genType y)
// genType greaterThan(genType x, genType y)
// genType greaterThanEqual(genType x, genType y)
// genType equal(genType x, genType y)
// genType notEqual(genType x, genType y)
// genType any(genType x)
// genType all(genType x)
// genType not(genType x)
// genType uaddCarry(genType x, genType y, out genType carry)
// genType usubBorrow(genType x, genType y, out genType borrow)



// intrinsically defined variables in vertex shaders
// in highp int gl_VertexID; - integer index for the vertex
// in highp int gl_InstanceID; - instance number of the current primitive in an instanced draw call
// out highp vec4  gl_Position; - homogeneous vertex position
// out highp float gl_PointSize; - size of the point to be rasterized

// built in constants for all shaders
// const mediump int  gl_MaxVertexAttribs = 16;
// const mediump int  gl_MaxVertexUniformVectors = 256;
// const mediump int  gl_MaxVertexOutputVectors = 16;
// const mediump int  gl_MaxFragmentInputVectors = 15;
// const mediump int  gl_MaxVertexTextureImageUnits = 16;
// const mediump int  gl_MaxCombinedTextureImageUnits = 32;
// const mediump int  gl_MaxTextureImageUnits = 16;
// const mediump int  gl_MaxFragmentUniformVectors = 224;
// const mediump int  gl_MaxDrawBuffers = 4;
// const mediump int  gl_MinProgramTexelOffset = -8;
// const mediump int  gl_MaxProgramTexelOffset = 7;

in vec2 a_vertex;
in vec2 a_texcoord;

out vec2 v_texcoord;

uniform vec2 u_translation;
uniform vec2 u_resolution;

void main(void) {
    vec2 clipSpace = 2.0 * ((a_vertex + u_translation) / u_resolution) - 1.0;
    vec4 pos = vec4(clipSpace * vec2(1, -1), 0, 1);
    gl_Position = pos;
    v_texcoord = a_texcoord;
}
