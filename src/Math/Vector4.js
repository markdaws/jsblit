/**
* A vector class representing four dimensional space
* @constructor
* @param {Number} x
* @param {Number} y
* @param {Number} z
* @param {Number} w
*/
function Vector4(x, y, z, w)
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vector4.prototype =
{
    /**
    * Calculates the dot product between the calling vector and parameter v
    * @param {Vector4} v input vector
    * @type Number
    */
    dot: function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    },

    /**
    * Creates a unit length version of the vector, which still points in the same direction as the original vector
    * @type Vector4
    */
    normalize: function () {
        var length, inverseLength;
        
        length = this.length();
        if (length < MathHelper.zeroTolerance) {
            return new Vector4(0.0, 0.0, 0.0, 0.0);
        }

        inverseLength = 1.0 / length;
        return new Vector4(this.x * inverseLength,
                           this.y * inverseLength,
                           this.z * inverseLength,
                           this.w * inverseLength);
    },

    /**
    * Calculates the length of the vector
    * @type Number
    */
    length: function () {
        return MathHelper.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    },

    /**
    * Calculates the length of the vector squared.  Useful if only a relative length
    * check is required, since this is more performant than the length() method
    */
    lengthSquared: function () {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    },

    /**
    * Adds vector v to the current vector and returns the result.
    * @param {Vector4} v input vector
    * @returns A vector containing the addition of the two input vectors
    * @type Vector4
    */
    add: function (v) {
        return new Vector4(this.x + v.x,
                           this.y + v.y,
                           this.z + v.z,
                           this.w + v.w);
    },

    /**
    * Subtracts vector v from the current vector and returns the result.
    * @param {Vector4} v input vector
    * @returns A vector containing the subtraction of the two input vectors
    * @type Vector4
    */
    subtract: function (v) {
        return new Vector4(this.x - v.x,
                           this.y - v.y,
                           this.z - v.z,
                           this.w - v.w);
    },

    /**
    * Multiplies each element of the vector with scalar f and returns the result
    * @param {Number} f a value that will be multiplied with each element of the vector
    * @type Vector4
    */
    multiplyScalar: function (f) {
        return new Vector4(this.x * f,
                           this.y * f,
                           this.z * f,
                           this.w * f);
    },

    /**
    * Checks if the calling vector is equal to parameter vector v
    * @param {Vector4} v input vector
    * @return A Boolean value, true if each element of the calling vector match input vector v, false otherwise
    * @type Boolean
    */
    equals: function (v) {
        return this.x === v.x &&
               this.y === v.y &&
               this.z === v.z &&
               this.w === v.w;
    },

    /**
    * Returns a string containing the current state of the vector, useful for debugging purposes
    * @type String
    */
    toString: function () {
        return '[' + this.x + ', ' + this.y + ', ' + this.z + ', ' + this.w + ']';
    }
};
