'use client'
// import styles from "./page.module.css";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { construct_path } from "../typescript/env";
import styles from "../stylesheets/css/login.module.css";
import { useRouter } from "next/navigation";
import { login_status } from "../typescript/user";

function LoginForm({ setForm }: { setForm: Dispatch<SetStateAction<string>> }) {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<string>("");

    async function login(e: React.FormEvent) {
        e.preventDefault(); // prevent page reload

        try {
            const res = await fetch(construct_path("api/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data: {
                response: {
                    status: number,
                    message: string,
                    token: string
                }
                error?: string
            } = await res.json();

            if (!res.ok) {
                setStatus(data.error || "Login failed due to bad credentials.");
            }
            
            if (res.status === 200) {
                localStorage.setItem("token", data.response.token);
                router.replace("/bubble");
            } else {
                setStatus(data.error || "An unknown error occurred.");
            }

        } catch (err) {
            setStatus(`Login failed: ${err instanceof Error ? err.message : 'Check console for details.'}`);
        }
    }

    useEffect(() => {
        login_status().then(status => {
            if (status === true) {
                router.replace("/bubble");
            }
        });
    }, [router]);

    return (
        <div className={styles.leftContainer}>
            <div className={styles.headerLogin}>
                <h3>Atlas</h3>
                <button onClick={() => setForm("creation")} className={styles.formButton}>Create Account</button>
            </div>

            <div className={styles.loginForm}>
                <h1>Login</h1>
                <form onSubmit={login}>
                    <input type="text" placeholder="Username:" onChange={(e) => setUsername(e.target.value)} value={username} />
                    <input type="password" placeholder="Password:" onChange={(e) => setPassword(e.target.value)} value={password} />
                    <button type="submit" className={styles.loginButton}>Login</button>
                </form>

                { status !== "" ?
                    <div className={styles.status}>
                        <p className={styles.icon}>!</p>
                        <p className={styles.details}>{status}</p>
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    )
}

function CreationForm({ setForm }: {setForm: Dispatch<SetStateAction<string>>}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    async function createAccount(e: React.FormEvent) {
        e.preventDefault();

        try {
            const res = await fetch(construct_path("api/create"), {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({username, password, displayName}),
            });

            if (!res.ok) throw new Error("Failed to create account");

            const data = await res.json();
        } catch (err) {
            console.error(err);
            alert("Failed to create account");
        }
    }

    return (
        <div className={styles.leftContainer}>
            <div className={styles.headerLogin}>
                <h3>Atlas</h3>
                <button onClick={() => setForm("login")} className={styles.formButton}>Login</button>
            </div>

            <div className={styles.loginForm}>
                <h1>Create Account</h1>
                <form onSubmit={createAccount}>
                    <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username} />
                    <input type="text" placeholder="display name" onChange={(e) => setDisplayName(e.target.value)} value={displayName} />
                    <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    <button type="submit" className={styles.loginButton}>Create Account</button>
                </form>
            </div>
        </div>
    )
}

export default function Home() {
    const [form, setForm] = useState<string>("login");

    return (
        <div className={styles.main}>
            {form === "login" ? <LoginForm setForm={setForm}/> : <CreationForm setForm={setForm}/>}
        </div>
    );
}
