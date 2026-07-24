"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage(){
  const [mode,setMode]=useState<"login"|"register"|"forgot">("login");
  const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setLoading(true);setMessage("");
    const form=new FormData(e.currentTarget),email=String(form.get("email")),password=String(form.get("password"));
    const supabase=createClient();
    if(!supabase){setMessage("Demo režim: prijava je uspešna. Supabase ključevi nisu postavljeni.");setLoading(false);setTimeout(()=>location.href="/",700);return}
    const result=mode==="register"?await supabase.auth.signUp({email,password}):mode==="forgot"?await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/profil`}):await supabase.auth.signInWithPassword({email,password});
    if(result.error)setMessage(result.error.message);else if(mode==="login")location.href="/";else setMessage(mode==="register"?"Proverite e-poštu i potvrdite registraciju.":"Poslali smo vezu za promenu lozinke.");
    setLoading(false);
  }
  return <main className="grid min-h-screen bg-ink lg:grid-cols-2"><section className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col"><div className="absolute -right-40 top-28 h-96 w-96 rounded-full bg-lime/20 blur-3xl"/><BrandMark/><div className="relative my-auto max-w-lg"><p className="text-xs font-bold tracking-[.2em] text-lime">PODACI. DISCIPLINA. ODGOVORNOST.</p><h1 className="mt-5 text-5xl font-black leading-[1.05]">Pametnija analiza počinje boljim podacima.</h1><p className="mt-6 text-slate-400">Pratite utakmice, procenite vrednost tržišta i merite rezultate modela na jednom mestu.</p></div><p className="text-xs text-slate-500">Analize ne garantuju dobitak. Kladite se odgovorno.</p></section><section className="flex items-center justify-center bg-canvas p-5"><div className="w-full max-w-md"><div className="mb-8 lg:hidden"><BrandMark/></div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">{mode==="login"?"Dobro došli nazad":mode==="register"?"Novi nalog":"Oporavak naloga"}</p><h2 className="mt-2 text-3xl font-black">{mode==="login"?"Prijavite se":mode==="register"?"Kreirajte nalog":"Zaboravljena lozinka"}</h2><form onSubmit={submit} className="card mt-7 space-y-4 p-6"><label className="block text-xs font-bold">E-adresa<input required type="email" name="email" className="focus-ring mt-2 w-full rounded-xl border border-slate-200 p-3" placeholder="ime@primer.rs"/></label>{mode!=="forgot"&&<label className="block text-xs font-bold">Lozinka<input required minLength={8} type="password" name="password" className="focus-ring mt-2 w-full rounded-xl border border-slate-200 p-3" placeholder="Najmanje 8 znakova"/></label>}{message&&<p className="rounded-xl bg-slate-100 p-3 text-xs">{message}</p>}<button disabled={loading} className="w-full rounded-xl bg-ink py-3 text-sm font-black text-white">{loading?"Sačekajte...":mode==="login"?"Prijavi se":mode==="register"?"Registruj se":"Pošalji vezu"}</button>{mode==="login"&&<button type="button" onClick={()=>setMode("forgot")} className="w-full text-xs font-bold text-slate-500">Zaboravili ste lozinku?</button>}</form><div className="mt-5 text-center text-xs text-slate-500">{mode==="register"?"Već imate nalog?":"Nemate nalog?"} <button onClick={()=>setMode(mode==="register"?"login":"register")} className="font-black text-ink">{mode==="register"?"Prijavite se":"Registrujte se"}</button></div><Link href="/" className="mt-6 block text-center text-xs font-bold text-slate-400">Nastavi u demo režimu →</Link></div></section></main>
}
