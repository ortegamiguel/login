import React from 'react';

const Body = () => {
    return (
        <form className="box">
            <div class="field">
                <label class="label">Email</label>
                <div class="control">
                    <input class="input" type="text"/>
                </div>
            </div>
            <div class="field">
                <label class="label">Password</label>
                <div class="control">
                    <input class="input" type="password"/>
                </div>
            </div>

            <button class="button is-primary">Sign in</button>
        </form>
    );
};

export default Body;