const templates = {};

templates.renewPasswordHtml = (jwtLink) => {
    return (
        `<div style="width:344px;margin:auto;padding:20px;border-radius:6px;background-color:#ffffff;text-align:center">
            <p style="margin:0px;margin-bottom:30px;font-size:18px;line-height:28px;font-weight:600">
                Did you forget your password?
            </p>
            <p style="margin:0px;margin-bottom:30px;text-align:justify;font-size:14px;line-height:20px">
                No te preocupes, recuperaremos tu cuenta enseguida. Restablece tu contraseña, una vez hayas terminado, podrás iniciar sesión con tu nueva contraseña.
            </p>
                <a href="${jwtLink}" style="width:100%;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://smartranks.co/auth/recover/c69fded4-7a91-4916-a316-74e9676e6fe3&amp;source=gmail&amp;ust=1702914446707000&amp;usg=AOvVaw0up3j873ATdwU3PH67QU6Y">
                    <div style="width:100%;padding:8px 0px;background-color:#15803d;color:#ffffff;border-radius:6px;font-size:14px;line-height:20px" jslog="32272; 1:WyIjdGhyZWFkLWY6MTc4NTU0NDYxNzQ3OTI3ODk4OCJd; 4:WyIjbXNnLWY6MTc4NTU0NDYxNzQ3OTI3ODk4OCJd">
                        Cambiar mi Contraseña
                    </div>
                </a>
            <p style="margin:0px;margin-top:20px;font-size:14px;line-height:20px;font-weight:600">
                Este link expira en 10 minutos
            </p>
        </div>`
    );
}

module.exports = templates; 