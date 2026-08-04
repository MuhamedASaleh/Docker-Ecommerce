const userRepository = require("../repositories/user.repository");
const { hashPassword } = require("../utils/password");
const ConflictError = require("../errors/ConflictError");
const { saveRefreshToken ,getRefreshToken ,deleteRefreshToken} = require("./redis.service");
const { comparePassword } = require("../utils/password");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { generateAccessToken,generateRefreshToken, verifyRefreshToken ,verifyAccessToken } = require("../utils/jwt");
async function register(userData) {

    const existingUser = await userRepository.findUserByEmail(
        userData.email
    );

    if (existingUser) {
        throw new ConflictError("Email already exists");
    }

    const hashedPassword = await hashPassword(
        userData.password
    );

    await userRepository.createUser({
        full_name: userData.full_name,
        email: userData.email,
        password_hash: hashedPassword
    });
}

async function login(credentials) {

    const user = await userRepository.findUserByEmail(
        credentials.email
    );

    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordCorrect =
        await comparePassword(
            credentials.password,
            user.password_hash
        );

    if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.is_active) {
        throw new UnauthorizedError("Account is disabled");
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(
        user.id,
        refreshToken
    );
    return {
        user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        },
        accessToken , refreshToken
    };

}
async function refresh(refreshToken) {

    const payload = verifyRefreshToken(refreshToken);

    const storedToken = await getRefreshToken(payload.sub);

    if (!storedToken) {
        throw new UnauthorizedError("Session expired");
    }

    if (storedToken !== refreshToken) {
        throw new UnauthorizedError("Invalid refresh token");
    }

    // TODO:
    // Replace findUserById with your actual repository method.
    const user = await userRepository.findUserById(payload.sub);

    if (!user) {
        throw new UnauthorizedError("User not found");
    }

    if (!user.is_active) {
        throw new UnauthorizedError("Account is disabled");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await saveRefreshToken(
        user.id,
        newRefreshToken
    );

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };

}
async function logout(userId) {

    await deleteRefreshToken(userId);

}


module.exports = {
    register,
    login,
    refresh,
    logout
};