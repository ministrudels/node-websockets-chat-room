import { useState, useContext } from 'react';
import { Button, Grid, Input } from '@material-ui/core';
import { UserContext } from '../contexts/userContext'

const avatars = [
    "https://semantic-ui.com/images/avatar2/small/patrick.png",
    "https://semantic-ui.com/images/avatar2/small/kristy.png",
    "https://semantic-ui.com/images/avatar2/small/mark.png",
    "https://semantic-ui.com/images/avatar2/small/matthew.png",
    "https://semantic-ui.com/images/avatar2/small/elyse.png",
    "https://semantic-ui.com/images/avatar2/small/lindsay.png",
];

const Login = () => {
    // Hold the state of the form while user interacts with login page
    const [usernameText, setUsernameText] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0])
    const { login } = useContext(UserContext)

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={3}>
            <Grid item container justifyContent="center">
                {
                    avatars.map((a, index) => (
                        <div className={a === selectedAvatar ? "avatar selected_avatar" : "avatar"} key={index}>
                            <img
                                src={a}
                                alt=''
                                onClick={() => setSelectedAvatar(a)} />
                        </div>
                    ))
                }
            </Grid>

            <Grid item>
                <Input placeholder={'Username'}
                    onChange={(e) => setUsernameText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') login(usernameText, selectedAvatar) }} />
            </Grid>

            <Grid item>
                <Button variant="contained" disableElevation onClick={() => login(usernameText, selectedAvatar)}>
                    Enter Chat!
                </Button>
            </Grid>
        </Grid>
    );
}

export default Login;