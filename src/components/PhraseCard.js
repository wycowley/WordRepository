// import { SupabaseAuthClient } from "@supabase/supabase-js/dist/main/lib/SupabaseAuthClient";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://hiiwioouscmwdgfhobom.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyODA0MTA5NiwiZXhwIjoxOTQzNjE3MDk2fQ.uMF3eAqCD2zgJnJJL6h2rKYSH-d2H6rsGrXGF74X-70");

const PhraseCard = (props) => {
    const [author, updateAuthor] = useState("SOMEONE");
    const [saved, updateStatus] = useState(false);
    const [likeAllowed, updateLikeStatus] = useState(true);
    const [likeCount, updateLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (supabase.auth.user()?.id == props.object?.userId) {
            updateAuthor("ME");
        }
        updateLikes(props.object?.likes);
        checkSaved();
        checkLiked();
    }, [props.object]);

    async function checkLiked() {
        try {
            const { data, error } = await supabase.from("users").select("likedPosts").match({ userId: supabase.auth.user()?.id });
            if (data[0].likedPosts.includes(props.object.id)) {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        } catch (error) {}
    }

    async function checkSaved() {
        try {
            const { data, error } = await supabase.from("users").select("savedPhrases", "id").match({ userId: supabase.auth.user()?.id });
            if (data[0].savedPhrases.includes(props.object.id)) {
                updateStatus(true);
            }
        } catch (error) {}
    }
    async function addLike() {
        if (!supabase.auth.user()) return;
        const { data: likesData, error: likesError } = await supabase.from("users").select("likedPosts").match({ userId: supabase.auth.user()?.id });
        console.log("likesData");
        console.log(likesData);
        console.log(likesData[0].likedPosts);

        if (likesData[0].likedPosts.includes(props.object.id)) {
            const { data: data2, error2 } = await supabase
                .from("pickuplines")
                .update([{ likes: likeCount - 1 }])
                .match({ id: props.object.id });

            let newLiked = [...likesData[0].likedPosts];
            newLiked = newLiked.filter((num) => num != props.object.id);
            const { data: data3, error4 } = await supabase
                .from("users")
                .update([{ likedPosts: newLiked }])
                .match({ userId: supabase.auth.user()?.id });
            updateLikes(likeCount - 1);
        } else {
            const { data: data2, error2 } = await supabase
                .from("pickuplines")
                .update([{ likes: likeCount + 1 }])
                .match({ id: props.object.id });

            const newLiked = [...likesData[0].likedPosts, props.object.id];
            const { data: data3, error4 } = await supabase
                .from("users")
                .update([{ likedPosts: newLiked }])
                .match({ userId: supabase.auth.user()?.id });
            updateLikes(likeCount + 1);
        }
        checkLiked();
    }
    async function addSaves() {
        if (!supabase.auth.user()) return;
        const { data, error } = await supabase.from("users").select("savedPhrases", "id").match({ userId: supabase.auth.user().id });
        if (data[0].savedPhrases.includes(props.object.id)) {
            var tempSaved = data[0].savedPhrases;
            const index = tempSaved.indexOf(props.object.id);
            tempSaved.splice(index, 1);
            const { data: data2, error2 } = await supabase
                .from("users")
                .update([{ savedPhrases: tempSaved }])
                .match({ userId: supabase.auth.user().id });
            updateStatus(false);

            return;
        }
        var array = [props.object.id, ...data[0].savedPhrases];
        console.log(array);
        const { data: data2, error2 } = await supabase
            .from("users")
            .update([{ savedPhrases: array }])
            .match({ userId: supabase.auth.user().id });
        updateStatus(true);
    }

    return (
        <>
            <div className='phrase-card'>
                <p className='phrase-card-text'>{props.object?.data}</p>
                {/* <p className='phrase-card-author'> */}
                <a href='' className='phrase-card-author'>
                    by {author}
                </a>
                {/* </p> */}

                <div className='phrase-card-actions'>
                    {props.object?.tags.map((type) => {
                        return <Tag data={type}></Tag>;
                    })}
                </div>
                <div className='phrase-card-actions' style={{ marginTop: 0 }}>
                    <button className='phrase-card-action' onClick={addLike} style={{ backgroundColor: isLiked ? "#ffdd00" : "" }}>
                        {likeCount == 1 ? <p style={{ color: isLiked ? "black" : "" }}>{likeCount} 💜</p> : <p style={{ color: isLiked ? "black" : "" }}>{likeCount} 💜</p>}
                    </button>
                    <button className='phrase-card-action' onClick={addSaves} style={{ backgroundColor: saved ? "var(--primary)" : "" }}>
                        💾
                        {/* {saved ? <p>Saved</p> : <p>Save</p>} */}
                    </button>
                </div>
            </div>
        </>
    );
};

function Tag(props) {
    return (
        <Link className='phrase-card-tag' to={"/search/" + props.data}>
            {props.data}
        </Link>
    );
}

export default PhraseCard;
