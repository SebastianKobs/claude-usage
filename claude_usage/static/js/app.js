//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = {}, r = Symbol("uninitialized"), i = "http://www.w3.org/1999/xhtml", a = "http://www.w3.org/2000/svg", o = "http://www.w3.org/1998/Math/MathML", s = Array.isArray, c = Array.prototype.indexOf, l = Array.prototype.includes, u = Array.from, d = Object.defineProperty, f = Object.getOwnPropertyDescriptor, p = Object.getOwnPropertyDescriptors, m = Object.prototype, h = Array.prototype, g = Object.getPrototypeOf, _ = Object.isExtensible, v = () => {};
function y(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function ee() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/constants.js
var b = 1 << 24, x = 1024, S = 2048, te = 4096, ne = 8192, re = 16384, ie = 32768, ae = 1 << 25, oe = 65536, se = 1 << 19, ce = 1 << 20, le = 1 << 25, ue = 1 << 21, de = 1 << 22, fe = 1 << 23, pe = Symbol("$state"), me = Symbol("component"), he = Symbol("legacy props"), ge = Symbol(""), _e = Symbol("attributes"), ve = Symbol("class"), ye = Symbol("style"), be = Symbol("text"), xe = Symbol("form reset"), Se = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Ce = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
function we() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Te(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ee() {
	console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function De() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var C = !1;
function Oe(e) {
	C = e;
}
var w;
function ke(e) {
	if (e === null) throw Te(), n;
	return w = e;
}
function Ae() {
	return ke(/* @__PURE__ */ un(w));
}
function T(e) {
	if (C) {
		if (/* @__PURE__ */ un(w) !== null) throw Te(), n;
		w = e;
	}
}
function je(e = 1) {
	if (C) {
		for (var t = e, n = w; t--;) n = /* @__PURE__ */ un(n);
		w = n;
	}
}
function Me(e = !0) {
	for (var t = 0, n = w;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ un(n);
		e && n.remove(), n = i;
	}
}
function Ne(e) {
	if (!e || e.nodeType !== 8) throw Te(), n;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Pe(e) {
	return e === this.v;
}
function Fe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Ie(e) {
	return !Fe(e, this.v);
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Le() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Re(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ze(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Be() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ve(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function He() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ue(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function We() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ge() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ke() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function qe() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var Je = null;
function Ye(e) {
	Je = e;
}
function E(e, t = !1, n) {
	Je = {
		p: Je,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: R,
		l: null
	};
}
function D(e) {
	var t = Je, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) En(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, Je = t.p, Xe(e);
}
function Xe(e = {}) {
	return d(e, me, { value: !0 }), e;
}
function Ze() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Qe = [];
function $e() {
	var e = Qe;
	Qe = [], y(e);
}
function et(e) {
	if (Qe.length === 0 && !Dt) {
		var t = Qe;
		queueMicrotask(() => {
			t === Qe && $e();
		});
	}
	Qe.push(e);
}
function tt() {
	for (; Qe.length > 0;) $e();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var nt = ~(S | te | x);
function rt(e, t) {
	e.f = e.f & nt | t;
}
function it(e) {
	e.f & 512 || e.deps === null ? rt(e, x) : rt(e, te);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function at(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), rt(e, x);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/misc.js
var ot = !1;
function st() {
	ot || (ot = !0, document.addEventListener("reset", (e) => {
		Promise.resolve().then(() => {
			if (!e.defaultPrevented) for (let t of e.target.elements) t[xe]?.();
		});
	}, { capture: !0 }));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ct(e) {
	var t = L, n = R;
	Xn(null), Zn(null);
	try {
		return e();
	} finally {
		Xn(t), Zn(n);
	}
}
function lt(e, t, n, r = n) {
	e.addEventListener(t, () => ct(n));
	let i = e[xe];
	e[xe] = i ? () => {
		i(), r(!0);
	} : () => r(!0), st();
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ut(e, t, n, r) {
	let i = Ze() ? mt : _t;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = R, c = dt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				yn(e, s);
			}
			ft();
		}
	}
	var d = pt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ gt(e))).then(u).catch((e) => yn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ft();
	}) : f();
}
function dt() {
	var e = R, t = L, n = Je, r = k;
	return function(i = !0) {
		Zn(e), Xn(t), Ye(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ft(e = !0) {
	Zn(null), Xn(null), Ye(null), e && k?.deactivate();
}
function pt() {
	var e = R, t = e.b, n = k, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function mt(e) {
	var t = 2 | S;
	return R !== null && (R.f |= se), {
		ctx: Je,
		deps: null,
		effects: null,
		equals: Pe,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: r,
		wv: 0,
		parent: R,
		ac: null
	};
}
var ht = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function gt(e, t, n) {
	let i = R;
	i === null && Le();
	var a = void 0, o = Wt(r), s = !L, c = /* @__PURE__ */ new Set();
	return kn(() => {
		var t = R, n = ee();
		a = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== Se && n.reject(e);
			}).finally(ft);
		} catch (e) {
			n.reject(e), ft();
		}
		var r = k;
		if (s) {
			if (t.f & 32768) var l = pt();
			if (i.b?.is_rendered()) r.async_deriveds.get(t)?.reject(ht);
			else for (let e of c.values()) e.reject(ht);
			c.add(n), r.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), c.delete(n), t !== ht && (r.activate(), t ? (o.f |= fe, Jt(o, t)) : (o.f & 8388608 && (o.f ^= fe), Jt(o, e)), r.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), wn(() => {
		for (let e of c) e.reject(ht);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === a ? e(o) : t(a);
			}
			n.then(r, r);
		}
		t(a);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function O(e) {
	let t = /* @__PURE__ */ mt(e);
	return $n(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function _t(e) {
	let t = /* @__PURE__ */ mt(e);
	return t.equals = Ie, t;
}
function vt(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Ln(t[n]);
	}
}
function yt(e) {
	var t, n = R, i = e.parent;
	if (!qn && i !== null && e.v !== r && i.f & 24576) return we(), e.v;
	Zn(i);
	try {
		vt(e), t = dr(e);
	} finally {
		Zn(n);
	}
	return t;
}
function bt(e) {
	var t = yt(e);
	if (!e.equals(t) && (e.wv = cr(), (!k?.is_fork || e.deps === null) && (k === null ? e.v = t : (k.capture(e, t, !0), wt?.capture(e, t, !0)), e.deps === null))) {
		rt(e, x);
		return;
	}
	qn || (Tt === null ? it(e) : (Cn() || k?.is_fork) && Tt.set(e, t));
}
function xt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && ct(() => {
		t.ac.abort(Se), t.ac = null;
	}), t.fn !== null && (t.teardown = v), mr(t, 0), Fn(t));
}
function St(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && hr(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var Ct = null, k = null, wt = null, Tt = null, Et = null, Dt = !1, Ot = !1, kt = null, At = null, jt = 0, Mt = 1, Nt = class e {
	id = Mt++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		Ct === null ? Ct = this : (Ct.#n = this, this.#t = Ct), Ct = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) rt(r, S), t(r);
			for (r of n.m) rt(r, te), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		var e = [];
		for (let i of this.#c) if (!(i.f & 16384 || !(i.f & 6144))) {
			for (var t = i, n = !1; t.parent !== null;) {
				t = t.parent;
				var r = t.f;
				if (r & 96) {
					if (!(r & 1024)) {
						n = !0;
						break;
					}
					t.f ^= x;
				}
			}
			n || e.push(t);
		}
		return this.#c = [], e;
	}
	#_() {
		this.#e = !0;
		for (let e of this.#u) this.#d.delete(e), rt(e, S), this.schedule(e);
		for (let e of this.#d) rt(e, te), this.schedule(e);
		this.apply();
		for (var t = kt = [], n = [], r = At = []; this.#c.length > 0;) {
			jt++ > 1e3 && (this.#S(), Ft());
			for (let e of this.#g()) try {
				this.#v(e, t, n);
			} catch (t) {
				throw Bt(e), this.#h() || this.discard(), t;
			}
		}
		if (k = null, r.length > 0) {
			var i = e.ensure();
			for (let e of r) i.schedule(e);
		}
		if (kt = null, At = null, this.#h()) {
			this.#x(n), this.#x(t);
			for (let [e, t] of this.#f) zt(e, t);
			r.length > 0 && k.#_();
			return;
		}
		let a = this.#y();
		if (a) {
			this.#x(n), this.#x(t), a.#b(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), wt = this, Lt(n), Lt(t), wt = null, this.#s?.resolve();
		var o = k;
		if (this.#a === 0 && (this.#c.length === 0 || o !== null) && this.#S(), this.#c.length > 0) {
			if (o !== null) {
				for (let e of this.#c) o.#c.push(e);
				this.#c = [];
			} else o = this;
		}
		o !== null && (Ht.clear(), o.#_());
	}
	#v(e, t, n) {
		e.f ^= x;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= x : i & 4 ? t.push(r) : lr(r) && (i & 16 && this.#d.add(r), hr(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#y() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#b(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), rt(i, S), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#S(), k = this, this.#_();
	}
	#x(e) {
		for (var t = 0; t < e.length; t += 1) at(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== r && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), Tt?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		k = this;
	}
	deactivate() {
		k = null, Tt = null;
	}
	flush() {
		try {
			Ot = !0, k = this, this.#_();
		} finally {
			jt = 0, Et = null, kt = null, At = null, Ot = !1, k = null, Tt = null, Ht.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(ht);
		this.#S(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, et(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= ee()).promise;
	}
	static ensure() {
		if (k === null) {
			let t = k = new e();
			!Ot && !Dt && et(() => {
				t.#e || t.flush();
			});
		}
		return k;
	}
	apply() {
		Tt = null;
	}
	schedule(e) {
		if (Et = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		this.#c.push(e);
	}
	#S() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? Ct = e : t.#t = e, this.linked = !1;
		}
	}
};
function Pt(e) {
	var t = Dt;
	Dt = !0;
	try {
		var n;
		for (e && (k !== null && !k.is_fork && k.flush(), n = e());;) {
			if (tt(), k === null) return n;
			k.flush();
		}
	} finally {
		Dt = t;
	}
}
function Ft() {
	try {
		He();
	} catch (e) {
		yn(e, Et);
	}
}
var It = null;
function Lt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && lr(r) && (It = /* @__PURE__ */ new Set(), hr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && zn(r), It?.size > 0)) {
				Ht.clear();
				for (let e of It) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) It.has(n) && (It.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || hr(n);
					}
				}
				It.clear();
			}
		}
		It = null;
	}
}
function Rt(e) {
	k.schedule(e);
}
function zt(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), rt(e, x);
		for (var n = e.first; n !== null;) zt(n, t), n = n.next;
	}
}
function Bt(e) {
	rt(e, x);
	for (var t = e.first; t !== null;) Bt(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Vt = /* @__PURE__ */ new Set(), Ht = /* @__PURE__ */ new Map(), Ut = !1;
function Wt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Pe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function A(e, t) {
	let n = Wt(e, t);
	return $n(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Gt(e, t = !1, n = !0) {
	let r = Wt(e);
	return t || (r.equals = Ie), r;
}
function j(e, t, n = !1) {
	return L !== null && (!Yn || L.f & 131072) && Ze() && L.f & 4325394 && (Qn === null || !Qn.has(e)) && Ke(), Jt(e, n ? Qt(t) : t, At);
}
var Kt = null, qt = 0;
function Jt(e, t, n = null) {
	if (!e.equals(t)) {
		qn ? Ht.set(e, t) : Ht.has(e) || Ht.set(e, e.v);
		var r = Nt.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && yt(t), Tt === null && it(t);
		}
		e.wv = cr(), Kt = null, qt = 0, Zt(e, S, n), Kt = null, Ze() && R !== null && R.f & 1024 && !(R.f & 96) && (nr === null ? rr([e]) : nr.push(e)), !r.is_fork && Vt.size > 0 && !Ut && Yt();
	}
	return t;
}
function Yt() {
	Ut = !1;
	for (let e of Vt) {
		e.f & 1024 && rt(e, te);
		let t;
		try {
			t = lr(e);
		} catch {
			t = !0;
		}
		t && hr(e);
	}
	Vt.clear();
}
function Xt(e) {
	j(e, e.v + 1);
}
function Zt(e, t, n) {
	var r = e.reactions;
	if (r !== null) {
		var i = Ze(), a = r.length;
		if (qt += a, qt > 1e5 && Kt === null && (Kt = /* @__PURE__ */ new Set()), Kt !== null) {
			if (Kt.has(e)) return;
			Kt.add(e);
		}
		for (var o = 0; o < a; o++) {
			var s = r[o], c = s.f;
			if (i || s !== R) {
				var l = (c & S) === 0;
				if (l && rt(s, t), c & 131072) Vt.add(s);
				else if (c & 2) {
					var u = s;
					Tt?.delete(u), Zt(u, te, n);
				} else if (l) {
					var d = s;
					c & 16 && It !== null && It.add(d), n === null ? Rt(d) : n.push(d);
				}
			}
		}
	}
}
function Qt(e) {
	if (typeof e != "object" || !e || pe in e || me in e) return e;
	let t = g(e);
	if (t !== m && t !== h) return e;
	var n = /* @__PURE__ */ new Map(), i = s(e), a = /* @__PURE__ */ A(0), o = null, c = or, l = (e) => {
		if (or === c) return e();
		var t = L, n = or;
		Xn(null), sr(c);
		var r = e();
		return Xn(t), sr(n), r;
	};
	return i && n.set("length", /* @__PURE__ */ A(e.length, o)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && We();
			var i = n.get(t);
			return i === void 0 ? l(() => {
				var e = /* @__PURE__ */ A(r.value, o);
				return n.set(t, e), e;
			}) : j(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var i = n.get(t);
			if (i === void 0) {
				if (t in e) {
					let e = l(() => /* @__PURE__ */ A(r, o));
					n.set(t, e), Xt(a);
				}
			} else j(i, r), Xt(a);
			return !0;
		},
		get(t, i, a) {
			if (i === pe) return e;
			var s = n.get(i), c = i in t;
			if (s === void 0 && (!c || f(t, i)?.writable) && (s = l(() => /* @__PURE__ */ A(Qt(c ? t[i] : r), o)), n.set(i, s)), s !== void 0) {
				var u = z(s);
				return u === r ? void 0 : u;
			}
			return Reflect.get(t, i, a);
		},
		getOwnPropertyDescriptor(e, t) {
			this.has?.(e, t);
			var i = Reflect.getOwnPropertyDescriptor(e, t), a = n.get(t);
			if (a !== void 0) {
				var o = z(a);
				if (o === r) return;
				if (i && "value" in i) i.value = o;
				else return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return i;
		},
		has(e, t) {
			if (t === pe) return !0;
			var i = n.get(t), a = i !== void 0 && i.v !== r || Reflect.has(e, t);
			return (i !== void 0 || R !== null && (!a || f(e, t)?.writable)) && (i === void 0 && (i = l(() => /* @__PURE__ */ A(a ? Qt(e[t]) : r, o)), n.set(t, i)), z(i) === r) ? !1 : a;
		},
		set(e, t, s, c) {
			var u = n.get(t), d = t in e;
			if (i && t === "length") for (var p = s; p < u.v; p += 1) {
				var m = n.get(p + "");
				m === void 0 ? p in e && (m = l(() => /* @__PURE__ */ A(r, o)), n.set(p + "", m)) : j(m, r);
			}
			if (u === void 0) (!d || f(e, t)?.writable) && (u = l(() => /* @__PURE__ */ A(void 0, o)), j(u, Qt(s)), n.set(t, u));
			else {
				d = u.v !== r;
				var h = l(() => Qt(s));
				j(u, h);
			}
			var g = Reflect.getOwnPropertyDescriptor(e, t);
			if (g?.set && g.set.call(c, s), !d) {
				if (i && typeof t == "string") {
					var _ = n.get("length"), v = Number(t);
					Number.isInteger(v) && v >= _.v && j(_, v + 1);
				}
				Xt(a);
			}
			return !0;
		},
		ownKeys(e) {
			z(a);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== r;
			});
			for (var [i, o] of n) o.v !== r && !(i in e) && t.push(i);
			return t;
		},
		setPrototypeOf() {
			Ge();
		}
	});
}
function $t(e) {
	try {
		if (typeof e == "object" && e && pe in e) return e[pe];
	} catch {}
	return e;
}
function en(e, t) {
	return Object.is($t(e), $t(t));
}
var tn, nn, rn, an, on;
function sn() {
	if (tn === void 0) {
		tn = window, nn = document, rn = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		an = f(t, "firstChild").get, on = f(t, "nextSibling").get, _(e) && (e[ve] = void 0, e[_e] = null, e[ye] = void 0, e.__e = void 0), _(n) && (n[be] = void 0);
	}
}
function cn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function ln(e) {
	return an.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function un(e) {
	return on.call(e);
}
function M(e, t) {
	if (!C) return /* @__PURE__ */ ln(e);
	var n = /* @__PURE__ */ ln(w);
	if (n === null) n = w.appendChild(cn());
	else if (t && n.nodeType !== 3) {
		var r = cn();
		return n?.before(r), ke(r), r;
	}
	return t && _n(n), ke(n), n;
}
function N(e, t = !1) {
	if (!C) {
		var n = /* @__PURE__ */ ln(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ un(n) : n;
	}
	if (t) {
		if (w?.nodeType !== 3) {
			var r = cn();
			return w?.before(r), ke(r), r;
		}
		_n(w);
	}
	return w;
}
function P(e, t = !1) {
	if (!C) return /* @__PURE__ */ ln(e);
	var n = M(e, t);
	return T(e), n;
}
function F(e, t = 1, n = !1) {
	let r = C ? w : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ un(r);
	if (!C) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = cn();
			return r === null ? i?.after(a) : r.before(a), ke(a), a;
		}
		_n(r);
	}
	return ke(r), r;
}
function dn(e) {
	e.textContent = "";
}
function fn() {
	return !1;
}
function pn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function mn() {
	return document.createDocumentFragment();
}
function hn(e = "") {
	return document.createComment(e);
}
function gn(e, t, n = "") {
	if (t.startsWith("xlink:")) {
		e.setAttributeNS("http://www.w3.org/1999/xlink", t, n);
		return;
	}
	return e.setAttribute(t, n);
}
function _n(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function vn(e) {
	var t = R;
	if (t === null) return L.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	yn(e, t);
}
function yn(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function bn(e) {
	R === null && (L === null && Ve(e), Be()), qn && ze(e);
}
function xn(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Sn(e, t) {
	var n = R;
	n !== null && n.f & 8192 && (e |= ne);
	var r = {
		ctx: Je,
		deps: null,
		nodes: null,
		f: e | S | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	k?.register_created_effect(r);
	var i = r;
	if (e & 4) kt === null ? Nt.ensure().schedule(r) : kt.push(r);
	else if (t !== null) {
		try {
			hr(r);
		} catch (e) {
			throw Ln(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= oe));
	}
	if (i !== null && (i.parent = n, n !== null && xn(i, n), L !== null && L.f & 2 && !(e & 64))) {
		var a = L;
		(a.effects ??= []).push(i);
	}
	return r;
}
function Cn() {
	return L !== null && !Yn;
}
function wn(e) {
	let t = Sn(8, null);
	return rt(t, x), t.teardown = e, t;
}
function Tn(e) {
	bn("$effect");
	var t = R.f;
	if (!L && t & 32 && Je !== null && !Je.i) {
		var n = Je;
		(n.e ??= []).push(e);
	} else return En(e);
}
function En(e) {
	return Sn(4 | ce, e);
}
function Dn(e) {
	Nt.ensure();
	let t = Sn(64 | se, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Bn(t, () => {
			Ln(t), n(void 0);
		}) : (Ln(t), n(void 0));
	});
}
function On(e) {
	return Sn(4, e);
}
function kn(e) {
	return Sn(de | se, e);
}
function An(e, t = 0) {
	return Sn(8 | t, e);
}
function I(e, t = [], n = [], r = []) {
	ut(r, t, n, (t) => {
		Sn(8, () => {
			e(...t.map(z));
		});
	});
}
function jn(e, t = 0) {
	return Sn(16 | t, e);
}
function Mn(e, t = 0) {
	return Sn(b | t, e);
}
function Nn(e) {
	return Sn(32 | se, e);
}
function Pn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = qn, r = L;
		Jn(!0), Xn(null);
		try {
			t.call(null);
		} catch (t) {
			yn(t, e.parent);
		} finally {
			Jn(n), Xn(r);
		}
	}
}
function Fn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ct(() => {
			e.abort(Se);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Ln(n, t), n = r;
	}
}
function In(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Ln(t), t = n;
	}
}
function Ln(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Rn(e.nodes.start, e.nodes.end), n = !0), e.f |= ae, Fn(e, t && !n), mr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Pn(e), e.f ^= ae, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && zn(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Rn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ un(e);
		e.remove(), e = n;
	}
}
function zn(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Bn(e, t, n = !0) {
	var r = [];
	e.f |= 256, Vn(e, r, !0);
	var i = () => {
		n && Ln(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Vn(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ne;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				Vn(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Hn(e) {
	e.f &= -257, Un(e, !0);
}
function Un(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ne, e.f & 1024 || (rt(e, S), Nt.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			Un(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Wn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ un(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Gn = null, Kn = !1, qn = !1;
function Jn(e) {
	qn = e;
}
var L = null, Yn = !1;
function Xn(e) {
	L = e;
}
var R = null;
function Zn(e) {
	R = e;
}
var Qn = null;
function $n(e) {
	L !== null && (L.f & 2097152 || L.f & 2) && (Qn ??= /* @__PURE__ */ new Set()).add(e);
}
var er = null, tr = 0, nr = null;
function rr(e) {
	nr = e;
}
var ir = 1, ar = 0, or = ar;
function sr(e) {
	or = e;
}
function cr() {
	return ++ir;
}
function lr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (lr(a) && bt(a), a.wv > e.wv) return !0;
		}
		t & 512 && Tt === null && rt(e, x);
	}
	return !1;
}
function ur(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Qn !== null && Qn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? ur(a, t, !1) : t === a && (n ? rt(a, S) : a.f & 1024 && rt(a, te), Rt(a));
	}
}
function dr(e) {
	var t = er, n = tr, r = nr, i = L, a = Qn, o = Je, s = Yn, c = or, l = e.f;
	er = null, tr = 0, nr = null, L = l & 96 ? null : e, Qn = null, Ye(e.ctx), Yn = !1, or = ++ar, e.ac !== null && (ct(() => {
		e.ac.abort(Se);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= ie;
		var f = fr(e);
		if (Ze() && nr !== null && !Yn && f !== null && !(e.f & 6146)) for (var p = 0; p < nr.length; p++) ur(nr[p], e);
		if (i !== null && i !== e) {
			if (ar++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ar;
			if (t !== null) for (let e of t) e.rv = ar;
			nr !== null && (r === null ? r = nr : r.push(...nr));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (t) {
		return fr(e), vn(t);
	} finally {
		e.f ^= ue, er = t, tr = n, nr = r, L = i, Qn = a, Ye(o), Yn = s, or = c;
	}
}
function fr(e) {
	var t = e.deps, n = k?.is_fork;
	if (er !== null) {
		var r;
		if (n || mr(e, tr), t !== null && tr > 0) for (t.length = tr + er.length, r = 0; r < er.length; r++) t[tr + r] = er[r];
		else e.deps = t = er;
		if (Cn() && e.f & 512) for (r = tr; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && tr < t.length && (mr(e, tr), t.length = tr);
	return t;
}
function pr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var i = c.call(n, e);
		if (i !== -1) {
			var a = n.length - 1;
			a === 0 ? n = t.reactions = null : (n[i] = n[a], n.pop());
		}
	}
	if (n === null && t.f & 2 && (er === null || !l.call(er, t))) {
		var o = t;
		o.f & 512 && (o.f ^= 512), o.v !== r && it(o), o.ac !== null && ct(() => {
			o.ac.abort(Se), o.ac = null, rt(o, S);
		}), xt(o), mr(o, 0);
	}
}
function mr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) pr(e, n[r]);
}
function hr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		rt(e, x);
		var n = R, r = Kn;
		R = e, Kn = !(t & 96);
		try {
			t & 16777232 ? In(e) : Fn(e), Pn(e);
			var i = dr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ir;
		} finally {
			Kn = r, R = n;
		}
	}
}
async function gr() {
	await Promise.resolve(), Pt();
}
function z(e) {
	var t = !!(e.f & 2);
	if (Gn?.add(e), L !== null && !Yn && !(R !== null && R.f & 16384) && (Qn === null || !Qn.has(e))) {
		var n = L.deps;
		if (L.f & 2097152) e.rv < ar && (e.rv = ar, er === null && n !== null && n[tr] === e ? tr++ : er === null ? er = [e] : er.push(e));
		else {
			L.deps ??= [], l.call(L.deps, e) || L.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [L] : l.call(r, L) || r.push(L);
		}
	}
	if (qn && Ht.has(e)) return Ht.get(e);
	if (t) {
		var i = e;
		if (qn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || vr(i)) && (a = yt(i)), Ht.set(i, a), a;
		}
		var o = !(i.f & 512) && !Yn && L !== null && (Kn || !!(L.f & 512)), s = (i.f & ie) === 0;
		lr(i) && (o && (i.f |= 512), bt(i)), o && !s && (St(i), _r(i));
	}
	if (Tt?.has(e)) return Tt.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function _r(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (St(t), _r(t));
}
function vr(e) {
	if (e.v === r) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Ht.has(t) || t.f & 2 && vr(t)) return !0;
	return !1;
}
function yr(e) {
	var t = Yn;
	try {
		return Yn = !0, e();
	} finally {
		Yn = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var br = Symbol("events"), xr = /* @__PURE__ */ new Set(), Sr = /* @__PURE__ */ new Set();
function Cr(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Or.call(t, e), !e.cancelBubble) return ct(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (i.__removed = !1, et(() => {
		i.__removed || t.addEventListener(e, i, r);
	})) : t.addEventListener(e, i, r), i;
}
function wr(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = Cr(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && wn(() => {
		o.__removed = !0, t.removeEventListener(e, o, a);
	});
}
function B(e, t, n) {
	(t[br] ??= {})[e] = n;
}
function Tr(e) {
	for (var t = 0; t < e.length; t++) xr.add(e[t]);
	for (var n of Sr) n(e);
}
var Er = null, Dr = !1;
function Or(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Er = e, Dr || (Dr = !0, setTimeout(() => {
		Dr = !1, Er = null;
	}));
	var o = 0, s = Er === e && e[br];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[br] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		d(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = L, f = R;
		Xn(null), Zn(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[br]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[br] = t, delete e.currentTarget, Xn(u), Zn(f);
		}
	}
}
globalThis?.window?.trustedTypes;
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
var kr = Ce ? "template" : "TEMPLATE";
function Ar(e, t) {
	var n = R;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
function jr(e, t) {
	var n = mn();
	for (var r of e) {
		if (typeof r == "string") {
			n.append(cn(r));
			continue;
		}
		if (r === void 0 || r[0][0] === "/") {
			n.append(hn(r ? r[0].slice(3) : ""));
			continue;
		}
		let [e, c, ...l] = r, u = e === "svg" ? a : e === "math" ? o : t;
		var i = pn(e, u, c?.is);
		for (var s in c) gn(i, s, c[s]);
		l.length > 0 && (i.nodeName === kr ? i.content : i).append(jr(l, i.nodeName === "foreignObject" ? void 0 : u)), n.append(i);
	}
	return n;
}
/*#__NO_SIDE_EFFECTS__*/
function V(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i;
	return () => {
		if (C) return Ar(w, null), w;
		i === void 0 && (i = jr(e, t & 4 ? a : t & 8 ? o : void 0), n || (i = /* @__PURE__ */ ln(i)));
		var s = r || rn ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var c = /* @__PURE__ */ ln(s), l = s.lastChild;
			Ar(c, l);
		} else Ar(s, s);
		return s;
	};
}
function Mr(e = "") {
	if (!C) {
		var t = cn(e + "");
		return Ar(t, t), t;
	}
	var n = w;
	return n.nodeType === 3 ? _n(n) : (n.before(n = cn()), ke(n)), Ar(n, n), n;
}
function H() {
	if (C) return Ar(w, null), w;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = cn();
	return e.append(t, n), Ar(t, n), e;
}
function U(e, t) {
	if (C) {
		var n = R;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = w), Ae();
		return;
	}
	e !== null && e.before(t);
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var Nr = ["touchstart", "touchmove"];
function Pr(e) {
	return Nr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Fr(e) {
	let t = 0, n = Wt(0), r;
	return () => {
		Cn() && (z(n), An(() => (t === 0 && (r = yr(() => e(() => Xt(n)))), t += 1, () => {
			et(() => {
				--t, t === 0 && (r?.(), r = void 0, Xt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var Ir = oe | se;
function Lr(e, t, n, r) {
	new Rr(e, t, n, r);
}
var Rr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = C ? w : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = Fr(() => (this.#m = Wt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = R;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = R.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = jn(() => {
			if (C) {
				let e = this.#t;
				Ae();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, Ir), C && (this.#e = w);
	}
	#g() {
		try {
			this.#a = Nn(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		et(r), t && (this.#s = Nn(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				De();
				return;
			}
			t = !0, n && qe(), this.#s !== null && Bn(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					yn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = Nn(() => e(this.#e)), et(() => {
			var e = this.#c = document.createDocumentFragment(), t = cn(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return Nn(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						yn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(k);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Bn(this.#o, () => {
				this.#o = null;
			}), this.#x(k));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Nn(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				Wn(this.#a, e);
				let t = this.#n.pending;
				this.#o = Nn(() => t(this.#e));
			} else this.#x(k);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		at(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = R, n = L, r = Je;
		Zn(this.#i), Xn(this.#i), Ye(this.#i.ctx);
		try {
			return Nt.ensure(), e();
		} finally {
			Zn(t), Xn(n), Ye(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Bn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, et(() => {
			this.#d = !1, this.#m && Jt(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), z(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		k?.is_fork ? (this.#a && k.skip_effect(this.#a), this.#o && k.skip_effect(this.#o), this.#s && k.skip_effect(this.#s), k.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (Ln(this.#a), null), this.#o &&= (Ln(this.#o), null), this.#s &&= (Ln(this.#s), null), C && (ke(this.#t), je(), ke(Me()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return Nn(() => {
						var r = R;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return yn(e, this.#i.parent), null;
				}
			}));
		};
		et(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				yn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => yn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function W(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[be] ??= e.nodeValue) && (e[be] = n, e.nodeValue = `${n}`);
}
function zr(e, t) {
	return Vr(e, t);
}
var Br = /* @__PURE__ */ new Map();
function Vr(e, { target: t, anchor: r, props: i = {}, events: a, context: o, intro: s = !0, transformError: c }) {
	sn();
	var l = void 0, d = Dn(() => {
		var s = r ?? t.appendChild(cn());
		Lr(s, { pending: () => {} }, (t) => {
			E({});
			var r = Je;
			if (o && (r.c = o), a && (i.$$events = a), C && Ar(t, null), l = e(t, i) || Xe(), C && (R.nodes.end = w, w === null || w.nodeType !== 8 || w.data !== "]")) throw Te(), n;
			D();
		}, c);
		var d = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!d.has(r)) {
					d.add(r);
					var i = Pr(r);
					for (let e of [t, document]) {
						var a = Br.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Br.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Or, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(u(xr)), Sr.add(f), () => {
			for (var e of d) for (let r of [t, document]) {
				var n = Br.get(r), i = n.get(e);
				--i == 0 ? (r.removeEventListener(e, Or), n.delete(e), n.size === 0 && Br.delete(r)) : n.set(e, i);
			}
			Sr.delete(f), s !== r && s.parentNode?.removeChild(s);
		};
	});
	return Hr.set(l, d), l;
}
var Hr = /* @__PURE__ */ new WeakMap();
function Ur(e, t) {
	let n = Hr.get(e);
	return n ? (Hr.delete(e), n(t)) : Promise.resolve();
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
var Wr = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) Hn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (Hn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (Ln(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						Wn(r, t), t.append(cn()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else Ln(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Bn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (Ln(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = k, r = fn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = cn();
				i.append(a), this.#n.set(e, {
					effect: Nn(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Nn(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else C && (this.anchor = w), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/snippet.js
function Gr(e, t, ...n) {
	var r = new Wr(e);
	jn(() => {
		let e = t() ?? null;
		r.ensure(e, e && ((t) => e(t, ...n)));
	}, oe);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function G(e, t, n = !1) {
	var r;
	C && (r = w, Ae());
	var i = new Wr(e), a = n ? oe : 0;
	function o(e, t) {
		if (C) {
			var n = Ne(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Me();
				ke(a), i.anchor = a, Oe(!1), i.ensure(e, t), Oe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	jn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/key.js
var Kr = Symbol("NaN");
function qr(e, t, n) {
	C && Ae();
	var r = new Wr(e), i = !Ze();
	jn(() => {
		var e = t();
		e !== e && (e = Kr), i && typeof e == "object" && e && (e = {}), r.ensure(e, n);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function Jr(e, t) {
	return t;
}
function Yr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Bn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Xr(e, u(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, d = l.parentNode;
			dn(d), d.append(l), e.items.clear();
		}
		Xr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Xr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= le, Wn(a, document.createDocumentFragment())) : Ln(t[i], n);
	}
}
var Zr;
function K(e, t, n, r, i, a = null) {
	var o = e, c = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = C ? ke(/* @__PURE__ */ ln(l)) : l.appendChild(cn());
	}
	C && Ae();
	var d = null, f = /* @__PURE__ */ _t(() => {
		var e = n();
		return s(e) ? e : e == null ? [] : u(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = d, $r(v, p, o, t, r), d !== null && (p.length === 0 ? d.f & 33554432 ? (d.f ^= le, ti(d, null, o)) : Hn(d) : Bn(d, () => {
			d = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: jn(() => {
			p = z(f);
			var e = p.length;
			let s = !1;
			C && Ne(o) === "[!" != (e === 0) && (o = Me(), ke(o), Oe(!1), s = !0);
			for (var l = /* @__PURE__ */ new Set(), u = k, v = fn(), y = 0; y < e; y += 1) {
				C && w.nodeType === 8 && w.data === "]" && (o = w, s = !0, Oe(!1));
				var ee = p[y], b = r(ee, y), x = h ? null : c.get(b);
				x ? (x.v && Jt(x.v, ee), x.i && Jt(x.i, y), v && u.unskip_effect(x.e)) : (x = ei(c, h ? o : Zr ??= cn(), ee, b, y, i, t, n), h || (x.e.f |= le), c.set(b, x)), l.add(b);
			}
			if (e === 0 && a && !d && (h ? d = Nn(() => a(o)) : (d = Nn(() => a(Zr ??= cn())), d.f |= le)), e > l.size && Re("", "", ""), C && e > 0 && ke(Me()), !h) {
				if (m.set(u, l), v) {
					for (let [e, t] of c) l.has(e) || u.skip_effect(t.e);
					u.oncommit(g), u.ondiscard(_);
				} else g(u);
			}
			s && Oe(!0), z(f);
		}),
		flags: t,
		items: c,
		pending: m,
		outrogroups: null,
		fallback: d
	};
	h = !1, C && (o = w);
}
function Qr(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function $r(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Qr(e.effect.first), l, d = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Hn(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= le, _ === c) ti(_, null, n);
			else {
				var y = d ? d.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), ni(e, d, _), ni(e, _, y), ti(_, y, n), d = _, p = [], m = [], c = Qr(d.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var ee = m[0], b;
					d = ee.prev;
					var x = p[0], S = p[p.length - 1];
					for (b = 0; b < p.length; b += 1) ti(p[b], ee, n);
					for (b = 0; b < m.length; b += 1) l.delete(m[b]);
					ni(e, x.prev, S.next), ni(e, d, x), ni(e, S, ee), c = ee, d = S, --v, p = [], m = [];
				} else l.delete(_), ti(_, c, n), ni(e, _.prev, _.next), ni(e, _, d === null ? e.effect.first : d.next), ni(e, d, _), d = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Qr(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), d = _, c = Qr(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Xr(e, u(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var te = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || te.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && te.push(c), c = Qr(c.next);
		var ne = te.length;
		if (ne > 0) {
			var re = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.measure();
				for (v = 0; v < ne; v += 1) te[v].nodes?.a?.fix();
			}
			Yr(e, te, re);
		}
	}
	a && et(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function ei(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Wt(n) : /* @__PURE__ */ Gt(n, !1, !1) : null, l = o & 2 ? Wt(i) : null;
	return {
		v: c,
		i: l,
		e: Nn(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function ti(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ un(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function ni(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function ri(e, t) {
	var n = void 0, r;
	Mn(() => {
		n !== (n = t()) && (r &&= (Ln(r), null), n && (r = Nn(() => {
			On(() => n(e));
		})));
	});
}
//#endregion
//#region node_modules/clsx/dist/clsx.mjs
function ii(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = ii(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function ai() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = ii(e)) && (r && (r += " "), r += t);
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function oi(e) {
	return typeof e == "object" ? ai(e) : e ?? "";
}
var si = [..." 	\n\r\f\xA0\v﻿"];
function ci(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || si.includes(r[o - 1])) && (s === r.length || si.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function li(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function ui(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function di(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(ui)), i && c.push(...Object.keys(i).map(ui));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = ui(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += li(r)), i && (n += li(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function fi(e, t, n, r, i, a) {
	var o = e[ve];
	if (C || o !== n || o === void 0) {
		var s = ci(n, r, a);
		(!C || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ve] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function pi(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function mi(e, t, n, r) {
	var i = e[ye];
	if (C || i !== t) {
		var a = di(t, r);
		(!C || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ye] = t;
	} else r && (Array.isArray(r) ? (pi(e, n?.[0], r[0]), pi(e, n?.[1], r[1], "important")) : pi(e, n, r));
	return r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function hi(e, t) {
	t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function gi(e, t) {
	var n = e.__defaultValue, r = e.multiple, i = r ? n ?? [] : null;
	if (!r || s(i)) {
		var a = e.selectedIndex, o = t && r ? new Set(e.selectedOptions) : null;
		for (var c of e.options) {
			var l = bi(c);
			hi(c, r ? i.includes(l) : en(l, n));
		}
		if (t) {
			if (o !== null) for (c of e.options) {
				var u = o.has(c);
				c.selected !== u && (c.selected = u);
			}
			else e.selectedIndex !== a && (e.selectedIndex = a);
		}
	}
}
function _i(e, t, n = !1) {
	if (e.multiple) {
		if (t == null) return;
		if (!s(t)) return Ee();
		for (var r of e.options) r.selected = t.includes(bi(r));
		return;
	}
	for (r of e.options) if (en(bi(r), t)) {
		r.selected = !0;
		return;
	}
	(!n || t !== void 0) && (e.selectedIndex = -1);
}
function vi(e) {
	var t = new MutationObserver((t) => {
		t.every(xi) || ("__defaultValue" in e && gi(e, !1), "__value" in e && _i(e, e.__value));
	});
	t.observe(e, {
		childList: !0,
		subtree: !0,
		attributes: !0,
		attributeFilter: ["value"]
	}), wn(() => {
		t.disconnect();
	});
}
function yi(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet(), i = !0;
	lt(e, "change", (t) => {
		var i = t ? "[selected]" : ":checked", a;
		if (e.multiple) a = [].map.call(e.querySelectorAll(i), bi);
		else {
			var o = e.querySelector(i) ?? e.querySelector("option:not([disabled])");
			a = o && bi(o);
		}
		n(a), e.__value = a, k !== null && r.add(k);
	}), On(() => {
		var a = t();
		if (e === document.activeElement) {
			var o = k;
			if (r.has(o)) return;
		}
		if (_i(e, a, i), i && a === void 0) {
			var s = e.querySelector(":checked");
			s !== null && (a = bi(s), n(a));
		}
		e.__value = a, i = !1;
	});
}
function bi(e) {
	return "__value" in e ? e.__value : e.value;
}
function xi(e) {
	if (e.target.closest("selectedcontent") !== null) return !0;
	if (e.type === "childList") {
		var t = [...e.addedNodes, ...e.removedNodes];
		return t.length > 0 && t.every((e) => e.nodeName === "SELECTEDCONTENT");
	}
	return !1;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Si = Symbol("is custom element"), Ci = Symbol("is html"), wi = Ce ? "link" : "LINK", Ti = Ce ? "progress" : "PROGRESS";
function Ei(e) {
	if (C) {
		var t = !1, n = () => {
			if (!t) {
				if (t = !0, e.hasAttribute("value")) {
					var n = e.value;
					q(e, "value", null), e.value = n;
				}
				if (e.hasAttribute("checked")) {
					var r = e.checked;
					q(e, "checked", null), e.checked = r;
				}
			}
		};
		e[xe] = n, et(n), st();
	}
}
function Di(e, t) {
	var n = Oi(e);
	n.value !== (n.value = t ?? void 0) && (e.value !== t || t === 0 && e.nodeName === Ti) && (e.value = t ?? "");
}
function q(e, t, n, r) {
	var i = Oi(e);
	C && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === wi) || i[t] !== (i[t] = n) && (t === "loading" && (e[ge] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ai(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Oi(e) {
	return e[_e] ??= {
		[Si]: e.nodeName.includes("-"),
		[Ci]: e.namespaceURI === i
	};
}
var ki = /* @__PURE__ */ new Map();
function Ai(e) {
	var t = e.getAttribute("is") || e.nodeName, n = ki.get(t);
	if (n) return n;
	ki.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = p(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = g(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function ji(e, t, n = t) {
	var r = /* @__PURE__ */ new WeakSet();
	lt(e, "input", async (i) => {
		var a = i ? e.defaultValue : e.value;
		if (a = Mi(e) ? Ni(a) : a, n(a), k !== null && r.add(k), await gr(), a !== (a = t())) {
			var o = e.selectionStart, s = e.selectionEnd, c = e.value.length;
			if (e.value = a ?? "", s !== null) {
				var l = e.value.length;
				o === s && s === c && l > c ? (e.selectionStart = l, e.selectionEnd = l) : (e.selectionStart = o, e.selectionEnd = Math.min(s, l));
			}
		}
	}), (C && e.defaultValue !== e.value || yr(t) == null && e.value) && (n(Mi(e) ? Ni(e.value) : e.value), k !== null && r.add(k)), An(() => {
		var n = t();
		if (e === document.activeElement) {
			var i = k;
			if (r.has(i)) return;
		}
		Mi(e) && n === Ni(e.value) || (e.type !== "date" || n || e.value) && n !== e.value && (e.value = n ?? "");
	});
}
function Mi(e) {
	var t = e.type;
	return t === "number" || t === "range";
}
function Ni(e) {
	return e === "" ? null : +e;
}
var Pi = /* @__PURE__ */ new class e {
	#e = /* @__PURE__ */ new WeakMap();
	#t;
	#n;
	static entries = /* @__PURE__ */ new WeakMap();
	constructor(e) {
		this.#n = e;
	}
	observe(e, t) {
		var n = this.#e.get(e) || /* @__PURE__ */ new Set();
		return n.add(t), this.#e.set(e, n), this.#r().observe(e, this.#n), () => {
			var n = this.#e.get(e);
			n.delete(t), n.size === 0 && (this.#e.delete(e), this.#t.unobserve(e));
		};
	}
	#r() {
		return this.#t ??= new ResizeObserver((t) => {
			for (var n of t) {
				e.entries.set(n.target, n);
				for (var r of this.#e.get(n.target) || []) r(n);
			}
		});
	}
}({ box: "border-box" });
function Fi(e, t, n) {
	var r = Pi.observe(e, () => n(e[t]));
	On(() => (yr(() => n(e[t])), r));
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Ii(e, t) {
	return e === t || e?.[pe] === t;
}
function Li(e = Xe(), t, n, r) {
	var i = Je.r, a = R;
	return On(() => {
		var o, s;
		return An(() => {
			o = s, s = r?.() || [], yr(() => {
				Ii(n(...s), e) || (t(e, ...s), o && Ii(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Ii(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
var Ri = !1;
function zi(e) {
	var t = Ri;
	try {
		return Ri = !1, [e(), Ri];
	} finally {
		Ri = t;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function Bi(e, t, n, r) {
	var i = !0, a = !!(n & 8), o = !!(n & 16), s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ mt(r), z(l)) : (c && (c = !1, s = o ? yr(r) : r), s);
	let d;
	if (a) {
		var p = pe in e || he in e;
		d = f(e, t)?.set ?? (p && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = zi(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && Ue(t), d(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? u() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return g;
	if (d) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && d(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? mt : _t)(() => (v = !1, g()));
	a && z(y);
	var ee = R;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? z(y) : i && a ? Qt(e) : e;
			return j(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return qn && v || ee.f & 16384 ? y.v : z(y);
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/components/Banner.svelte
var Vi = /* @__PURE__ */ V([[
	"div",
	{
		class: "banner",
		role: "alert"
	},
	" "
]]);
function Hi(e, t) {
	E(t, !0);
	var n = Vi(), r = P(n, !0);
	I(() => W(r, t.messages.text)), U(e, n), D();
}
var Ui = 12;
function Wi(e) {
	return Math.max(320, e);
}
function Gi(e, t) {
	return e && t ? e / t : 1;
}
function Ki(e, t, n, r) {
	return (e - t) * r / (n || r);
}
function qi(e, t, n) {
	let r = Math.max(1, Math.round(n / 10)), i = {
		ArrowLeft: -1,
		ArrowDown: -1,
		ArrowRight: 1,
		ArrowUp: 1,
		PageUp: -r,
		PageDown: r
	}, a = n - 1;
	if (e === "Home") return 0;
	if (e === "End") return a;
	let o = i[e];
	return o === void 0 ? null : Math.min(Math.max(0, t + o), a);
}
function Ji(e, t, n) {
	return Math.max(0, Math.min(e + Ui, n - t));
}
function Yi(e, t = 8) {
	let n = Math.max(1, Math.ceil(e / t));
	return Array.from({ length: Math.ceil(e / n) }, (e, t) => t * n);
}
function Xi(e) {
	return Math.round(e) + .5;
}
//#endregion
//#region src/lib/colors.ts
var Zi = /* @__PURE__ */ t({
	BACKGROUND_EFFORT: () => na,
	EFFORT_ORDER: () => ea,
	EFFORT_SHADES: () => aa,
	HATCH_SHADES: () => oa,
	HATCH_TURNS: () => sa,
	KNOWN_MODELS: () => Qi,
	SLOT_COUNT: () => 8,
	effortHatch: () => fa,
	effortLabel: () => ia,
	effortName: () => ra,
	effortRank: () => ta,
	effortShade: () => da,
	hatchTurn: () => pa,
	modelSlots: () => $i,
	shade: () => ua,
	slotColor: () => la,
	swatchFill: () => ma
}), Qi = [
	"claude-opus-5-5",
	"claude-sonnet-5",
	"claude-opus-5",
	"claude-haiku-4-5",
	"claude-fable-5-1",
	"claude-opus-4-8",
	"claude-fable-5",
	"claude-sonnet-4-6"
];
function $i(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of Qi.entries()) e.includes(r) && t.set(r, n);
	let n = new Set(t.values()), r = Array.from({ length: 8 }, (e, t) => t).filter((e) => !n.has(e));
	for (let n of e.filter((e) => !Qi.includes(e)).sort()) t.set(n, r.shift() ?? null);
	return t;
}
var ea = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"ultracode"
];
function ta(e) {
	let t = ea.indexOf(e);
	return t === -1 ? ea.length : t;
}
var na = "background";
function ra(e) {
	return e === "background" ? "background calls" : e ? `effort ${e}` : "no effort level";
}
function ia(e) {
	return e === "background" ? "background calls" : e ?? "no effort level";
}
var aa = {
	background: 0,
	medium: 1,
	high: 2,
	xhigh: 3,
	max: 3,
	ultracode: 3
}, oa = {
	background: 1,
	ultracode: 4
}, sa = {
	background: -45,
	ultracode: 45
};
function ca(e, t) {
	return t && Object.hasOwn(e, t) ? e[t] ?? null : null;
}
function la(e) {
	return e === null ? "var(--series-other)" : `var(--series-${e + 1})`;
}
function ua(e, t) {
	let n = e === null ? "other" : e + 1;
	return t === 0 ? la(e) : `color-mix(in oklab, var(--series-${n}), var(--shade-ink) calc(var(--shade-step-${n}) * ${t}))`;
}
function da(e, t) {
	return ua(e, ca(aa, t) ?? 0);
}
function fa(e, t) {
	let n = ca(oa, t);
	return n ? ua(e, n) : null;
}
function pa(e) {
	return ca(sa, e);
}
function ma(e, t, n) {
	return !t || n === null ? e : `repeating-linear-gradient(${90 + n}deg, ${t} 0 1.5px, ${e} 1.5px 4px)`;
}
//#endregion
//#region src/lib/format.ts
var ha = /* @__PURE__ */ t({
	ago: () => Ma,
	compact: () => J,
	dayText: () => Ea,
	duration: () => wa,
	longDay: () => Oa,
	longHour: () => ja,
	money: () => X,
	parseDay: () => Ta,
	parseHour: () => ka,
	percent: () => Ca,
	shortDay: () => Da,
	shortHour: () => Aa,
	signed: () => Sa,
	when: () => Z,
	whole: () => Y
}), ga = "–", _a = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1
}), va = new Intl.NumberFormat("en"), ya = {
	month: "short",
	day: "numeric"
}, ba = {
	weekday: "short",
	month: "short",
	day: "numeric"
}, xa = {
	hour: "2-digit",
	minute: "2-digit"
};
function J(e) {
	return e == null ? ga : _a.format(e);
}
function Sa(e) {
	return e < 0 ? `−${J(-e)}` : `+${J(e)}`;
}
function Y(e) {
	return e == null ? ga : va.format(e);
}
function X(e) {
	return e == null ? ga : Math.abs(e) >= 1e3 ? "$" + _a.format(e) : "$" + e.toFixed(e >= 100 ? 0 : 2);
}
function Ca(e, t) {
	if (!t) return ga;
	let n = 100 * e / t;
	return (n > 0 && n < 10 ? n.toFixed(1) : String(Math.round(n))) + "%";
}
function wa(e) {
	if (e == null) return ga;
	let t = Math.round(e / 1e3), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60);
	return n ? r ? `${n} h ${r} min` : `${n} h` : r ? t % 60 ? `${r} min ${t % 60} s` : `${r} min` : `${t} s`;
}
function Ta(e) {
	let [t = 0, n = 1, r = 1] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function Ea(e) {
	let t = (e) => String(e).padStart(2, "0");
	return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Da(e, t) {
	return Ta(e).toLocaleDateString(t, ya);
}
function Oa(e, t) {
	return Ta(e).toLocaleDateString(t, ba);
}
function ka(e) {
	let [t = "", n = "0"] = e.split("T"), r = Ta(t);
	return r.setHours(Number(n)), r;
}
function Aa(e, t) {
	return ka(e).toLocaleTimeString(t, xa);
}
function ja(e, t) {
	let n = ka(e), r = new Date(n.getTime() + 36e5), i = (e) => e.toLocaleTimeString(t, xa);
	return `${n.toLocaleDateString(t, ba)}, ${i(n)}–${i(r)}`;
}
function Z(e, t) {
	return e ? new Date(e).toLocaleString(t, {
		...ya,
		...xa
	}) : ga;
}
function Ma(e, t = Date.now(), n) {
	if (!e) return ga;
	let r = Math.max(0, Math.round((t - new Date(e).getTime()) / 1e3));
	return r < 60 ? `${r} s ago` : r < 3600 ? `${Math.floor(r / 60)} min ago` : Z(e, n);
}
//#endregion
//#region src/lib/charts.ts
var Na = /* @__PURE__ */ t({
	LIMIT_ICON: () => "⚠",
	NO_USAGE: () => Ka,
	RATE_LIMIT: () => Qa,
	bandIndex: () => Ba,
	barShare: () => so,
	bucketTotals: () => qa,
	chartSeries: () => Ja,
	columnPath: () => Ha,
	columnTotals: () => Xa,
	columnWidth: () => Va,
	costSplit: () => ao,
	costTop: () => oo,
	daysSince: () => Wa,
	errorText: () => to,
	inputTotal: () => Pa,
	limitCounts: () => no,
	limitTop: () => La,
	limitType: () => eo,
	lineX: () => Ra,
	modelGroups: () => Ya,
	nearestIndex: () => za,
	niceMax: () => Fa,
	peakIndex: () => Ua,
	stackSegments: () => Za,
	ticks: () => Ia,
	timeBuckets: () => Ga,
	windowHitAfter: () => ro,
	windowSpan: () => io
});
function Pa(e) {
	return e.new_input + e.cache_write + e.cache_read;
}
function Fa(e) {
	if (e <= 0) return 1;
	let t = 10 ** Math.floor(Math.log10(e));
	for (let n of [
		1,
		2,
		2.5,
		5,
		10
	]) if (e <= n * t) return n * t;
	return 10 * t;
}
function Ia(e, t) {
	return Array.from({ length: t + 1 }, (n, r) => e * r / t);
}
function La(e) {
	return Math.max(2, Math.ceil(Fa(e) / 2) * 2);
}
function Ra(e, t, n) {
	let r = e - 1;
	return (e) => r > 0 ? t + (n - t) * e / r : (t + n) / 2;
}
function za(e, t, n) {
	return (r) => n > 1 ? Math.round((r - e) / (t - e) * (n - 1)) : 0;
}
function Ba(e, t) {
	return (n) => Math.floor((n - e) / t);
}
function Va(e, t = 24) {
	return Math.max(2, Math.min(t, e * .6));
}
function Ha(e, t, n, r, i, a = 4) {
	let o = i ? Math.min(a, n / 2, r) : 0;
	return `M${e},${t + r}V${t + o}` + (o ? `Q${e},${t} ${e + o},${t}H${e + n - o}Q${e + n},${t} ${e + n},${t + o}` : `H${e + n}`) + `V${t + r}Z`;
}
function Ua(e) {
	return e.indexOf(Math.max(...e));
}
function Wa(e, t = /* @__PURE__ */ new Date()) {
	let n = [];
	for (let r = Ta(e); r <= t; r.setDate(r.getDate() + 1)) n.push(Ea(r));
	return n;
}
function Ga(e, t = /* @__PURE__ */ new Date()) {
	if (e.days !== 1 || !e.hour_model) return {
		keys: Wa(e.since, t),
		unit: "day",
		heading: "Day",
		short: Da,
		long: Oa,
		keyOf: (e) => e.day ?? ""
	};
	let n = e.since === Ea(t) ? t.getHours() : 23, r = [];
	for (let t = 0; t <= n; t += 1) r.push(`${e.since}T${String(t).padStart(2, "0")}`);
	return {
		keys: r,
		unit: "hour",
		heading: "Hour",
		short: Aa,
		long: ja,
		keyOf: (e) => e.hour ?? ""
	};
}
var Ka = {
	cost: 0,
	input: 0,
	output: 0
};
function qa(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			cost: 0,
			input: 0,
			output: 0
		};
		i.cost += r.cost || 0, i.input += Pa(r), i.output += r.output, n.set(e, i);
	}
	return n;
}
function Ja(e, t, n) {
	let r = $i([...new Set(e.map((e) => e.model))]), i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let e = r.get(a.model) ?? null, o = e === null ? "Other" : a.model, s = `${o} · ${ra(a.effort)}`, c = i.get(s);
		c || (c = {
			key: s,
			model: o,
			effort: a.effort,
			slot: e,
			color: da(e, a.effort),
			hatch: fa(e, a.effort),
			turn: pa(a.effort),
			values: /* @__PURE__ */ new Map()
		}, i.set(s, c));
		let l = t(a);
		c.values.set(l, (c.values.get(l) ?? 0) + n(a));
	}
	let a = (e) => e === "background" ? -2 : e == null ? -1 : ta(e);
	return [...i.values()].sort((e, t) => (e.slot ?? 8) - (t.slot ?? 8) || e.model.localeCompare(t.model) || a(e.effort) - a(t.effort) || String(e.effort).localeCompare(String(t.effort)));
}
function Ya(e) {
	let t = [];
	for (let n of e) {
		let e = t[t.length - 1];
		e?.model !== n.model && (e = {
			model: n.model,
			entries: []
		}, t.push(e)), e.entries.push(n);
	}
	return t;
}
function Xa(e, t) {
	return t.map((t) => e.reduce((e, n) => e + (n.values.get(t) ?? 0), 0));
}
function Za(e, t, n, r = 2, i = 4) {
	let a = [], o = n;
	return t.forEach((n, s) => {
		let c = s === 0 ? 0 : e[s - 1] === e[s] ? r : i, l = n - (n > c ? c : 0);
		l > 0 && a.push({
			position: s,
			y: o - n,
			height: l,
			top: s === t.length - 1
		}), o -= n;
	}), a;
}
var Qa = "rate_limit", $a = {
	five_hour: "5-hour limit",
	seven_day: "weekly limit",
	seven_day_opus: "weekly Opus limit"
};
function eo(e) {
	return e ? Object.hasOwn($a, e) ? $a[e] ?? e : e.replaceAll("_", " ") : "–";
}
function to(e) {
	let t = e.status ? ` (${e.status})` : "";
	return e.error === "rate_limit" ? `⚠ Rate limit${t}` : `${e.error.replaceAll("_", " ")}${t}`;
}
function no(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t(r), i = n.get(e) ?? {
			limits: 0,
			other: 0
		};
		r.error === "rate_limit" ? i.limits += r.count : i.other += r.count, n.set(e, i);
	}
	return (e) => n.get(e) ?? {
		limits: 0,
		other: 0
	};
}
function ro(e) {
	return Date.parse(e.first_hit) - Date.parse(e.start);
}
function io(e, t) {
	let n = new Date(e.start), r = new Date(e.resets_at), i = n.toDateString() === r.toDateString() ? r.toLocaleTimeString(t, {
		hour: "2-digit",
		minute: "2-digit"
	}) : Z(e.resets_at, t);
	return `${Z(e.start, t)} – ${i}`;
}
function ao(e) {
	let t = e.cost_parts.cache_read;
	return {
		cacheRead: t,
		rest: Math.max(0, (e.cost || 0) - t)
	};
}
function oo(e) {
	return Math.max(0, ...e.map((e) => e.cost || 0)) || 1;
}
function so(e, t) {
	return 100 * (e || 0) / t;
}
//#endregion
//#region src/lib/bymodel.ts
var co = {
	cost: {
		label: "Estimated cost",
		value: (e) => e.cost || 0,
		format: X
	},
	output: {
		label: "Output tokens",
		value: (e) => e.output,
		format: J
	},
	input: {
		label: "Input tokens",
		value: Pa,
		format: J
	}
}, lo = Object.keys(co);
function uo(e) {
	return lo.find((t) => t === e) ?? "cost";
}
var fo = 248;
function po(e, t, n = /* @__PURE__ */ new Date()) {
	let r = co[t], i = Ga(e, n), a = Ja(i.unit === "hour" ? e.hour_model_effort : e.day_model_effort, i.keyOf, r.value);
	return {
		buckets: i,
		series: a,
		totals: Xa(a, i.keys),
		metric: r
	};
}
function mo(e, t) {
	let n = e - 8, r = (n - 56) / t;
	return {
		right: n,
		band: r,
		barWidth: Va(r, 24)
	};
}
function ho(e, t) {
	return Ba(56, mo(e, t).band);
}
function go(e, t, n) {
	let { band: r, barWidth: i } = mo(e, t);
	return 56 + r * n + (r - i) / 2;
}
function _o(e, t, n) {
	let r = e.filter((e) => (e.values.get(t) ?? 0) > 0), i = r.map((e) => 220 * (e.values.get(t) ?? 0) / n);
	return Za(r.map((e) => e.model), i, 220, 2, 4).map((e) => ({
		entry: r[e.position],
		segment: e
	}));
}
function vo(e) {
	let t = e.filter((e) => e.hatch).map((e, t) => ({
		id: `model-hatch-${t}`,
		entry: e
	})), n = new Map(t.map((e) => [e.entry, e.id]));
	return {
		patterns: t,
		fill: (e) => n.has(e) ? `url(#${n.get(e)})` : e.color
	};
}
function yo(e, t) {
	return `${e.label} per ${t} by model and effort level; table view available`;
}
function bo(e, t) {
	return `${e.label} per ${t}; arrow keys step through them`;
}
function xo(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${e.metric.format(e.totals[t] ?? 0)}`;
}
function So(e) {
	return Ya(e).map((e) => ({
		model: e.model,
		entries: e.entries.map((e) => ({
			entry: e,
			text: ia(e.effort)
		}))
	}));
}
function Co(e, t) {
	return Ya(e.filter((e) => e.values.get(t))).map((e) => ({
		model: e.model,
		value: e.entries.reduce((e, n) => e + (n.values.get(t) ?? 0), 0),
		efforts: e.entries.slice().reverse().map((e) => ({
			entry: e,
			text: ia(e.effort),
			value: e.values.get(t) ?? 0
		}))
	}));
}
function wo(e) {
	let { buckets: t, series: n, metric: r } = e, i = t.keys.slice().reverse().map((e) => {
		let i = n.map((t) => t.values.get(e) ?? 0);
		return {
			key: e,
			cells: [
				t.short(e),
				...i.map((e) => e ? r.format(e) : "–"),
				r.format(i.reduce((e, t) => e + t, 0))
			]
		};
	});
	return {
		head: [
			t.heading,
			...n.map((e) => e.key),
			"Total"
		],
		rows: i
	};
}
//#endregion
//#region node_modules/svelte/src/reactivity/map.js
var To = class extends Map {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ A(0);
	#n = /* @__PURE__ */ A(0);
	#r = or || -1;
	constructor(e) {
		if (super(), e) {
			for (var [t, n] of e) super.set(t, n);
			this.#n.v = super.size;
		}
	}
	#i(e) {
		return or === this.#r ? /* @__PURE__ */ A(e) : Wt(e);
	}
	has(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else return z(this.#t), !1;
		}
		return z(n), !0;
	}
	forEach(e, t) {
		this.#a(), super.forEach(e, t);
	}
	get(e) {
		var t = this.#e, n = t.get(e);
		if (n === void 0) {
			if (super.has(e)) n = this.#i(0), t.set(e, n);
			else {
				z(this.#t);
				return;
			}
		}
		return z(n), super.get(e);
	}
	getOrInsert(e, t) {
		return super.has(e) || this.set(e, t), this.get(e);
	}
	getOrInsertComputed(e, t) {
		return super.has(e) || this.set(e, t(e)), this.get(e);
	}
	set(e, t) {
		var n = this.#e, r = n.get(e), i = super.get(e), a = super.set(e, t), o = this.#t;
		if (r === void 0) r = this.#i(0), n.set(e, r), j(this.#n, super.size), Xt(o);
		else if (i !== t) {
			Xt(r);
			var s = o.reactions === null ? null : new Set(o.reactions);
			(s === null || !r.reactions?.every((e) => s.has(e))) && Xt(o);
		}
		return a;
	}
	delete(e) {
		var t = this.#e, n = t.get(e), r = super.delete(e);
		return n !== void 0 && (t.delete(e), j(n, -1)), r && (j(this.#n, super.size), Xt(this.#t)), r;
	}
	clear() {
		if (super.size !== 0) {
			super.clear();
			var e = this.#e;
			j(this.#n, 0);
			for (var t of e.values()) j(t, -1);
			Xt(this.#t), e.clear();
		}
	}
	#a() {
		z(this.#t);
		var e = this.#e;
		if (this.#n.v !== e.size) {
			for (var t of super.keys()) if (!e.has(t)) {
				var n = this.#i(0);
				e.set(t, n);
			}
		}
		for ([, n] of this.#e) z(n);
	}
	keys() {
		return z(this.#t), super.keys();
	}
	values() {
		return this.#a(), super.values();
	}
	entries() {
		return this.#a(), super.entries();
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	get size() {
		return z(this.#n), super.size;
	}
}, Eo = /* @__PURE__ */ t({
	Payload: () => Do,
	payload: () => Q,
	setPayload: () => Oo
}), Do = class {
	#e = /* @__PURE__ */ A(null);
	#t = /* @__PURE__ */ A(!1);
	#n = /* @__PURE__ */ A(null);
	#r = /* @__PURE__ */ A(!1);
	#i = /* @__PURE__ */ A(null);
	#a = /* @__PURE__ */ A(null);
	#o = new To();
	get summary() {
		return z(this.#e);
	}
	get summaryFailed() {
		return z(this.#t);
	}
	get live() {
		return z(this.#n);
	}
	get liveFailed() {
		return z(this.#r);
	}
	get liveAt() {
		return z(this.#i);
	}
	get session() {
		return z(this.#a);
	}
	liveState(e) {
		return this.#o.get(e);
	}
	setLiveState(e, t) {
		this.#o.set(e, t);
	}
	keepLiveStates(e) {
		let t = [...e];
		for (let e of [...this.#o.keys()]) t.includes(e) || this.#o.delete(e);
	}
	set(e) {
		e.summary !== void 0 && (j(this.#e, e.summary), j(this.#t, !1)), e.summaryFailed !== void 0 && j(this.#t, e.summaryFailed, !0), e.live !== void 0 && (j(this.#n, e.live), j(this.#r, !1)), e.liveFailed !== void 0 && j(this.#r, e.liveFailed, !0), e.liveAt !== void 0 && j(this.#i, e.liveAt, !0), e.session !== void 0 && j(this.#a, e.session);
	}
	reset() {
		j(this.#e, null), j(this.#t, !1), j(this.#n, null), j(this.#r, !1), j(this.#i, null), j(this.#a, null), this.#o.clear();
	}
}, Q = new Do();
function Oo(e) {
	Q.set(e), Pt();
}
//#endregion
//#region src/lib/tables.ts
var ko = /* @__PURE__ */ t({
	DEFAULT_PAGE_SIZE: () => 25,
	PAGE_SIZES: () => Ao,
	SESSION_COLUMNS: () => Lo,
	TOOL_KINDS: () => Bo,
	USAGE_COLUMNS: () => ts,
	byCost: () => es,
	chatRows: () => $o,
	detailNoun: () => Ko,
	emptyDetail: () => Uo,
	entryKey: () => Qo,
	kindLabel: () => Ho,
	orderedEntries: () => Zo,
	pageSizeFrom: () => Po,
	pageText: () => No,
	pageUnits: () => jo,
	pageWindow: () => Mo,
	sessionCells: () => Ro,
	sessionCount: () => zo,
	sessionMatches: () => Fo,
	sessionProjects: () => Io,
	toolFolds: () => Yo,
	toolRowClass: () => qo,
	toolRowName: () => Jo,
	toolRowShown: () => Xo,
	toolTableRows: () => Vo,
	usageCells: () => ns
}), Ao = [
	10,
	25,
	50
];
function jo(e) {
	let t = -1;
	return e.map((e) => ((!e || t < 0) && (t += 1), t));
}
function Mo(e, t, n) {
	let r = Math.max(1, Math.ceil(e / t)), i = Math.min(Math.max(n, 0), r - 1);
	return {
		page: i,
		pages: r,
		first: i * t,
		last: Math.min(e, (i + 1) * t)
	};
}
function No(e, t, n = "rows") {
	return `${n} ${e.first + 1}–${e.last} of ${t}`;
}
function Po(e, t, n) {
	let r = Number(e);
	return t.includes(r) ? r : n;
}
function Fo(e, t, n) {
	if (t && e.project !== t) return !1;
	let r = `${e.title || ""} ${e.project} ${e.session_id}`.toLowerCase();
	return n.toLowerCase().split(/\s+/).filter(Boolean).every((e) => r.includes(e));
}
function Io(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.project, (n.get(t.project) ?? 0) + 1);
	return t && !n.has(t) && n.set(t, 0), [...n].sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => ({
		project: e,
		count: t
	}));
}
var Lo = [
	{ label: "Last activity" },
	{ label: "Session" },
	{
		label: "Subagents",
		numeric: !0
	},
	{
		label: "Turns",
		numeric: !0
	},
	{
		label: "Avg context",
		numeric: !0
	},
	{
		label: "Peak context",
		numeric: !0
	},
	{
		label: "Output",
		numeric: !0
	},
	{
		label: "Cost",
		numeric: !0
	}
];
function Ro(e) {
	return [
		Z(e.last_ts),
		Y(e.subagents),
		Y(e.turns),
		J(e.context_avg),
		J(e.context_peak),
		J(e.output),
		X(e.cost)
	];
}
function zo(e, t) {
	let n = `${t} session${t === 1 ? "" : "s"}`;
	return e === t ? n : `${e} of ${n}`;
}
var Bo = {
	search: "search",
	view: "view",
	list: "list",
	edit_in_place: "edit in place",
	write_file: "write a file",
	inline_script: "inline script",
	git: "git",
	run: "run a program"
};
function Vo(e) {
	return e.flatMap((e) => {
		let t = e.agent_id ?? "";
		return e.tool_kinds ? e.tool_kinds.map((n) => {
			let r = [
				n.tool,
				n.kind,
				n.detail,
				n.options
			], i = r.findLastIndex((e) => e !== null), a = (e) => JSON.stringify([t, ...e]), o = r.map((e, t) => t === i ? null : e), s = a(r), c = i > 1 ? a(o) : null;
			return {
				...n,
				key: s,
				agent: e.agent_type,
				sub: i > 0,
				fold: s,
				parent: c
			};
		}) : e.tools.map((n) => ({
			key: JSON.stringify([
				t,
				n.tool,
				"stored"
			]),
			agent: e.agent_type,
			tool: n.tool,
			kind: null,
			detail: null,
			options: null,
			fold: null,
			parent: null,
			sub: !1,
			calls: n.calls,
			errors: null,
			result_chars: n.result_chars,
			result_median: null,
			result_p90: null,
			input_median: null,
			calls_after_median: null,
			carried: null,
			input_cost: null
		}));
	});
}
function Ho(e, t) {
	let n = e.kind ?? "";
	return e.tool === "Bash" && Object.hasOwn(t, n) ? t[n] ?? n : n;
}
function Uo(e) {
	if (e.kind !== null) return "(none)";
	let t = {
		Glob: "no single type",
		Skill: "no name"
	};
	return Object.hasOwn(t, e.tool) ? t[e.tool] ?? "no type" : "no type";
}
var Wo = {
	inline_script: ["interpreter", "interpreters"],
	git: ["subcommand", "subcommands"]
}, Go = {
	Grep: ["output mode", "output modes"],
	Agent: ["subagent type", "subagent types"],
	Task: ["subagent type", "subagent types"],
	Skill: ["skill", "skills"]
};
function Ko(e, t) {
	let n = e.kind ?? "", r;
	return r = e.detail === null ? e.kind === null ? Object.hasOwn(Go, e.tool) && Go[e.tool] || ["file type", "file types"] : e.tool === "MCP" ? ["tool", "tools"] : Object.hasOwn(Wo, n) && Wo[n] || ["program", "programs"] : ["option set", "option sets"], t === 1 ? r[0] : r[1];
}
function qo(e, t) {
	return e.sub ? "sub-row" : t?.sub ? "group-row" : null;
}
function Jo(e) {
	let t = e.kind === null ? " under-tool" : "";
	return e.options === null ? e.detail === null ? e.sub ? {
		className: "tool-kind",
		text: Ho(e, Bo)
	} : {
		className: null,
		text: e.tool
	} : {
		className: `tool-detail${t}`,
		text: e.detail || Uo(e)
	} : {
		className: `tool-options${t}`,
		text: e.options || "no options"
	};
}
function Yo(e) {
	let t = /* @__PURE__ */ new Map(), n = e.map((e, n) => {
		let r = e.parent === null ? void 0 : t.get(e.parent), i = e.parent !== null && r ? [...r.above, e.parent] : [];
		return r && (r.members += 1), e.fold && t.set(e.fold, {
			above: i,
			row: n,
			members: 0
		}), i;
	}), r = [];
	for (let [n, { row: i, members: a }] of t) {
		let t = e[i];
		a && t && r.push({
			fold: n,
			row: i,
			members: a,
			label: `${Y(a)} ${Ko(t, a)}`
		});
	}
	return {
		above: n,
		folds: r
	};
}
function Xo(e, t) {
	return e.every((e) => t.has(e));
}
function Zo(e, t) {
	if (t) return e;
	let n = [];
	for (let t of e) {
		let e = n[n.length - 1];
		t.message_id && e?.[0]?.message_id === t.message_id ? e.push(t) : n.push([t]);
	}
	return n.reverse().flat();
}
function Qo(e, t) {
	return `${e.timestamp} ${e.kind} ${t}`;
}
function $o(e, t) {
	let n = new Map(e.map((e, t) => [e, t]));
	return Zo(e, t).map((e) => ({
		key: Qo(e, n.get(e) ?? 0),
		entry: e
	}));
}
function es(e, t) {
	return (t.cost ?? -1) - (e.cost ?? -1) || t.turns - e.turns;
}
var ts = [
	{
		label: "Turns",
		numeric: !0
	},
	{
		label: "Input",
		numeric: !0
	},
	{
		label: "Cache read %",
		numeric: !0
	},
	{
		label: "Output",
		numeric: !0
	},
	{
		label: "Cost",
		numeric: !0
	}
];
function ns(e) {
	let t = Pa(e);
	return [
		Y(e.turns),
		J(t),
		Ca(e.cache_read, t),
		J(e.output),
		X(e.cost)
	];
}
//#endregion
//#region src/lib/themes.ts
var rs = /* @__PURE__ */ t({
	THEMES: () => is,
	themeFooter: () => us,
	themeLabel: () => ls,
	themeName: () => ss
}), is = [
	"light",
	"dark",
	"hacker",
	"startup",
	"rgb"
], as = { techbro: "rgb" }, os = {
	hacker: {
		"Claude usage": "claude-usage --watch",
		"Estimated cost": "burn_rate",
		"Input tokens": "context_window.log",
		Turns: "requests",
		"API calls with usage": "200 OK, all of them",
		"Output tokens": "tokens >> /dev/prod",
		Processed: "cache_miss",
		"From cache": "cache_hit",
		"Live sessions": "ps aux | grep claude",
		"Over time": "git log --graph",
		"Per day, by model": "top -o model",
		"Per day, by model and effort": "top -o model,effort",
		"Per hour, by model and effort": "top -o model,effort",
		"Cost per session": "sort -rn cost | head",
		"By agent type": "kubectl get agents",
		"By model": "model --benchmark",
		"By project": "ls ~/repos",
		Sessions: "history | tail",
		"Session time": "uptime",
		"Waiting on the API": "await api.response()",
		"Running tools": "time ./tools.sh",
		"Lines changed": "git diff --stat",
		"Rate limits": "grep 429 access.log",
		"5-hour windows that hit the limit": "ulimit -t 18000",
		"Latest API errors": "tail -f error.log",
		"Rate limits and API errors": "tail -f error.log",
		"By skill": "ls ~/.claude/skills",
		"By MCP server": "netstat --mcp",
		Conversation: "less session.jsonl",
		footer: " Works on my machine ¯\\_(ツ)_/¯"
	},
	startup: {
		"Claude usage": "Claude usage — Series A ready",
		"Estimated cost": "Infra spend",
		"Input tokens": "Context throughput",
		Turns: "Inference calls",
		"API calls with usage": "p99 < vibes",
		"Output tokens": "Tokens shipped",
		Processed: "Compute",
		"From cache": "Cached (efficient)",
		"Live sessions": "Shipping now",
		"Over time": "Growth",
		"Per day, by model": "Model mix",
		"Per day, by model and effort": "Model × effort mix",
		"Per hour, by model and effort": "Model × effort mix",
		"Cost per session": "Burn per sprint",
		"By agent type": "Team",
		"By model": "Stack",
		"By project": "Portfolio",
		Sessions: "Changelog",
		"Session time": "Time to value",
		"Waiting on the API": "Vendor latency",
		"Running tools": "Automation hours",
		"Lines changed": "Velocity (LoC)",
		"Rate limits": "Hypergrowth friction",
		"5-hour windows that hit the limit": "Burn rate before the wall",
		"Latest API errors": "Incident postmortems",
		"Rate limits and API errors": "Incident postmortems",
		"By skill": "Core competencies",
		"By MCP server": "Integrations",
		Conversation: "Standup notes",
		footer: " We're hiring. (We're not.)"
	},
	rgb: {
		"Claude usage": "Claude usage // battlestation",
		"Estimated cost": "💸 Damage dealt",
		"Input tokens": "🧠 Context loaded",
		Turns: "⚡ APM (API calls)",
		"API calls with usage": "no lag, every frame",
		"Output tokens": "🚀 Tokens fragged",
		Processed: "Raw render",
		"From cache": "Cached frames",
		"Live sessions": "🔴 Live on stream",
		"Over time": "📈 K/D over time",
		"Per day, by model": "🎮 Loadout per day",
		"Per day, by model and effort": "🎮 Loadout × difficulty per day",
		"Per hour, by model and effort": "🎮 Loadout × difficulty per hour",
		"Cost per session": "💀 Boss fights",
		"By agent type": "🕹️ Squad",
		"By model": "🏆 Tier list",
		"By project": "🗺️ Maps",
		Sessions: "🎬 Match history",
		"Session time": "⏱️ Playtime",
		"Waiting on the API": "📡 Ping",
		"Running tools": "🛠️ Crafting time",
		"Lines changed": "⚔️ Combo counter",
		"Rate limits": "🧊 Cooldowns",
		"5-hour windows that hit the limit": "🔋 Stamina drained",
		"Latest API errors": "💥 Crash log",
		"Rate limits and API errors": "💥 Crash log",
		"By skill": "🎯 Skill tree",
		"By MCP server": "🔌 Mods",
		Conversation: "🎙️ Voice chat",
		footer: " GG. RGB adds +15% performance."
	}
};
function ss(e) {
	if (e == null) return null;
	let t = (Object.hasOwn(as, e) ? as[e] : e) ?? e;
	return is.includes(t) ? t : null;
}
function cs(e) {
	return e !== null && Object.hasOwn(os, e) ? os[e] ?? {} : {};
}
function ls(e, t) {
	let n = cs(e);
	return Object.hasOwn(n, t) ? n[t] ?? t : t;
}
function us(e) {
	return cs(e).footer ?? "";
}
//#endregion
//#region src/lib/prefs.svelte.ts
var ds = /* @__PURE__ */ t({
	Preferences: () => hs,
	footerCopy: () => _s,
	hype: () => $,
	preferences: () => gs,
	readPreference: () => fs,
	savePreference: () => ps,
	savedOption: () => ms
});
function fs(e) {
	try {
		return localStorage.getItem(`claude-usage.${e}`);
	} catch {
		return null;
	}
}
function ps(e, t) {
	try {
		localStorage.setItem(`claude-usage.${e}`, String(t));
	} catch {}
}
function ms(e, t) {
	let n = fs(e);
	return n !== null && t.includes(n) ? n : null;
}
var hs = class {
	#e = /* @__PURE__ */ A(Qt(ss(fs("theme"))));
	#t = /* @__PURE__ */ A(Qt(Po(fs("page_size"), Ao, 25)));
	#n = /* @__PURE__ */ A(fs("chat-oldest-first") === "true");
	get theme() {
		return z(this.#e);
	}
	set theme(e) {
		let t = ss(e);
		j(this.#e, t, !0), ps("theme", t ?? "auto");
	}
	get pageSize() {
		return z(this.#t);
	}
	set pageSize(e) {
		Ao.includes(e) && (j(this.#t, e, !0), ps("page_size", String(e)));
	}
	get oldestFirst() {
		return z(this.#n);
	}
	set oldestFirst(e) {
		j(this.#n, e, !0), ps("chat-oldest-first", String(e));
	}
}, gs = new hs();
function $(e) {
	return ls(gs.theme, e);
}
function _s() {
	return us(gs.theme);
}
//#endregion
//#region src/components/ChartTooltip.svelte
var vs = /* @__PURE__ */ V([[
	"div",
	{ class: "tooltip" },
	,
]]);
function ys(e, t) {
	E(t, !0);
	let n = Bi(t, "top", 3, 8);
	function r(e) {
		let r = e.parentElement?.clientWidth ?? 0;
		e.style.left = `${Ji(t.anchor, e.offsetWidth, r)}px`, e.style.top = `${n()}px`;
	}
	var i = vs();
	Gr(M(i), () => t.children), T(i), ri(i, () => r), U(e, i), D();
}
//#endregion
//#region src/components/Chart.svelte
var bs = /* @__PURE__ */ V([["rect", {
	class: "hit",
	tabindex: "0",
	role: "slider",
	"aria-valuemin": "1"
}]], 4), xs = /* @__PURE__ */ V([[
	"svg",
	null,
	[
		"g",
		{ role: "img" },
		,
		,
	],
	,
], ,], 5);
function Ss(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => (t.cursor?.count ?? 0) - 1), r = /* @__PURE__ */ A(null), i = /* @__PURE__ */ O(() => z(r) === null ? z(n) : Math.min(z(r), z(n))), a = /* @__PURE__ */ A(null), o = /* @__PURE__ */ O(() => z(a) === null || z(n) < 0 ? null : Math.min(z(a), z(n))), s = /* @__PURE__ */ O(() => t.cursor?.area(t.width));
	function c(e) {
		j(r, Math.min(Math.max(0, e), z(n)), !0), j(a, z(r), !0);
	}
	function l(e) {
		let n = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
		t.cursor && n && c(t.cursor.indexAt(t.width)(Ki(e.clientX, n.left, n.width, t.width)));
	}
	function u(e) {
		if (!t.cursor) return;
		let n = qi(e.key, z(i), t.cursor.count);
		n !== null && (c(n), e.preventDefault());
	}
	var d = xs(), f = N(d), p = M(f), m = M(p);
	Gr(m, () => t.plot, () => t.width);
	var h = F(m), g = (e) => {
		var n = H();
		Gr(N(n), () => t.marks ?? v, () => t.width, () => z(o)), U(e, n);
	};
	G(h, (e) => {
		z(o) !== null && e(g);
	}), T(p);
	var _ = F(p), y = (e) => {
		var n = bs();
		I((e, r) => {
			q(n, "x", z(s).x), q(n, "y", z(s).y), q(n, "width", e), q(n, "height", z(s).height), q(n, "aria-label", t.cursor.label), q(n, "aria-valuemax", t.cursor.count), q(n, "aria-valuenow", z(i) + 1), q(n, "aria-valuetext", r);
		}, [() => Math.max(1, z(s).width), () => t.cursor.valueText(z(i))]), B("pointermove", n, l), wr("focus", n, () => c(z(i))), B("keydown", n, u), wr("pointerleave", n, () => j(a, null)), wr("blur", n, () => j(a, null)), U(e, n);
	};
	G(_, (e) => {
		t.cursor && z(s) && z(n) >= 0 && e(y);
	}), T(f);
	var ee = F(f), b = (e) => {
		{
			let n = /* @__PURE__ */ O(() => t.cursor.tipX(t.width, z(o)) * Gi(t.containerWidth, t.width));
			ys(e, {
				get anchor() {
					return z(n);
				},
				get top() {
					return t.tipTop;
				},
				children: (e, n) => {
					var r = H();
					Gr(N(r), () => t.tip, () => z(o)), U(e, r);
				},
				$$slots: { default: !0 }
			});
		}
	};
	G(ee, (e) => {
		t.cursor && z(o) !== null && t.tip && e(b);
	}), I(() => {
		q(f, "viewBox", `0 0 ${t.width ?? ""} ${t.height ?? ""}`), q(f, "height", t.height), q(p, "aria-label", t.label);
	}), U(e, d), D();
}
Tr(["pointermove", "keydown"]);
//#endregion
//#region src/components/ChartCard.svelte
var Cs = /* @__PURE__ */ V([[
	"span",
	{ class: "muted" },
	" "
]]), ws = /* @__PURE__ */ V([[
	"section",
	{ class: "card" },
	[
		"div",
		{ class: "chart-head" },
		[
			"h2",
			null,
			" "
		],
		" ",
		,
		" ",
		,
		" ",
		["span", { class: "spacer" }],
		" ",
		[
			"button",
			{ type: "button" },
			"Table view"
		]
	],
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
]]);
function Ts(e, t) {
	let n = /* @__PURE__ */ A(!1);
	var r = ws(), i = M(r), a = M(i), o = P(a, !0), s = F(a, 2), c = (e) => {
		var n = Cs(), r = P(n, !0);
		I(() => W(r, t.note)), U(e, n);
	};
	G(s, (e) => {
		t.note && e(c);
	});
	var l = F(s, 2);
	Gr(l, () => t.controls ?? v);
	var u = F(l, 4);
	T(i);
	var d = F(i, 2);
	Gr(d, () => t.legend ?? v);
	var f = F(d, 2);
	Gr(f, () => t.chart);
	var p = F(f, 2), m = (e) => {
		var n = H();
		Gr(N(n), () => t.table), U(e, n);
	};
	G(p, (e) => {
		z(n) && e(m);
	}), Gr(F(p, 2), () => t.extra ?? v), T(r), I(() => {
		q(r, "aria-labelledby", `${t.id ?? ""}-title`), q(a, "id", `${t.id ?? ""}-title`), W(o, t.title), q(u, "id", `${t.id ?? ""}-table-toggle`), q(u, "aria-pressed", z(n));
	}), B("click", u, () => j(n, !z(n))), U(e, r);
}
Tr(["click"]);
//#endregion
//#region src/components/Swatch.svelte
var Es = /* @__PURE__ */ V([["span", { class: "swatch" }]]);
function Ds(e, t) {
	var n = Es();
	let r;
	I(() => r = mi(n, "", r, { background: t.fill })), U(e, n);
}
//#endregion
//#region src/lib/scroll.ts
var Os = /* @__PURE__ */ t({
	keepScroll: () => As,
	scrollAnchor: () => ks
});
function ks(e) {
	for (let t of e) {
		let e = t.getBoundingClientRect();
		if (e.bottom > 0) return {
			node: t,
			top: e.top
		};
	}
	return null;
}
function As(e, t) {
	e && t && t.isConnected && window.scrollBy(0, t.getBoundingClientRect().top - e.top);
}
//#endregion
//#region src/components/Pager.svelte
var js = /* @__PURE__ */ V([[
	"option",
	null,
	" "
]]), Ms = /* @__PURE__ */ V([[
	"div",
	{
		class: "pager",
		role: "group",
		"aria-label": "Pages"
	},
	["select"],
	" ",
	[
		"button",
		{ type: "button" },
		"‹ Previous"
	],
	" ",
	[
		"span",
		{
			class: "muted",
			"aria-live": "polite"
		},
		" "
	],
	" ",
	[
		"button",
		{ type: "button" },
		"Next ›"
	]
]]);
function Ns(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => (t.units.at(-1) ?? -1) + 1), r = /* @__PURE__ */ O(() => Ls(t.key, z(n))), i = /* @__PURE__ */ O(() => `${t.noun.charAt(0).toUpperCase()}${t.noun.slice(1)}`);
	function a() {
		Is.first(t.key) !== z(r).first && Is.set(t.key, z(r).first);
	}
	a();
	function o(e, r) {
		let i = e.closest(".pager"), a = ks(i ? [i] : []);
		Is.set(t.key, Mo(z(n), gs.pageSize, r).first), Pt(), As(a, i);
	}
	function s(e, t) {
		let n = e.closest(".pager"), r = ks(n ? [n] : []);
		gs.pageSize = t, Pt(), As(r, n);
	}
	function c() {
		let { first: e, last: n } = z(r);
		t.rows?.forEach((r, i) => {
			let a = t.units[i];
			a !== void 0 && r.classList.toggle("off-page", a < e || a >= n);
		});
	}
	var l = Ms(), u = M(l);
	K(u, 20, () => Ao, (e) => e, (e, n) => {
		var r = js(), i = P(r), a = {};
		I(() => {
			W(i, `${n ?? ""} ${t.noun ?? ""}`), a !== (a = n) && (r.value = (r.__value = a) ?? "");
		}), U(e, r);
	}), T(u);
	var d;
	vi(u);
	var f = F(u, 2), p = F(f, 2), m = P(p, !0), h = F(p, 2);
	T(l), ri(l, () => c), I((e) => {
		q(u, "id", `pager-${t.key ?? ""}-size`), q(u, "aria-label", `${z(i) ?? ""} per page`), d !== (d = gs.pageSize) && (u.value = (u.__value = d) ?? "", _i(u, d)), q(f, "id", `pager-${t.key ?? ""}-previous`), f.disabled = z(r).page === 0, W(m, e), q(h, "id", `pager-${t.key ?? ""}-next`), h.disabled = z(r).page === z(r).pages - 1;
	}, [() => No(z(r), z(n), t.noun)]), B("change", u, (e) => s(e.currentTarget, Number(e.currentTarget.value))), B("click", f, (e) => o(e.currentTarget, z(r).page - 1)), B("click", h, (e) => o(e.currentTarget, z(r).page + 1)), U(e, l), D();
}
Tr(["change", "click"]);
//#endregion
//#region src/lib/paging.svelte.ts
var Ps = /* @__PURE__ */ t({
	TablePages: () => Fs,
	mountPager: () => zs,
	releaseDetachedPagers: () => Bs,
	shownWindow: () => Ls,
	tablePages: () => Is
}), Fs = class {
	#e = new To();
	first(e) {
		return this.#e.get(e) ?? 0;
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	forget(e) {
		this.#e.delete(e);
	}
}, Is = new Fs();
function Ls(e, t) {
	return Mo(t, gs.pageSize, Math.floor(Is.first(e) / gs.pageSize));
}
var Rs = /* @__PURE__ */ new Set();
function zs(e) {
	let t = document.createElement("div"), n = zr(Ns, {
		target: t,
		props: e
	});
	Pt();
	let r = t.firstElementChild;
	if (!(r instanceof HTMLElement)) throw Error("The pager drew no element");
	return Rs.add({
		component: n,
		root: r
	}), r;
}
function Bs() {
	for (let e of [...Rs]) e.root.isConnected || (Rs.delete(e), Ur(e.component));
}
//#endregion
//#region src/components/TableView.svelte
var Vs = /* @__PURE__ */ V([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), Hs = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), Us = /* @__PURE__ */ V([[
	"th",
	{ scope: "col" },
	" "
]]), Ws = /* @__PURE__ */ V([[
	"tr",
	null,
	,
]]), Gs = /* @__PURE__ */ V([[
	"table",
	null,
	[
		"thead",
		null,
		["tr"]
	],
	["tbody"]
]]), Ks = /* @__PURE__ */ V([
	,
	,
	" ",
	,
	" ",
	[
		"div",
		{ class: "table-wrap" },
		,
		" ",
		,
	]
], 1);
function qs(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = H(), o = N(n), s = (e) => {
			Ns(e, {
				get key() {
					return t.key;
				},
				get noun() {
					return r();
				},
				get units() {
					return z(i);
				}
			});
		};
		G(o, (e) => {
			z(a) > Ao[0] && e(s);
		}), U(e, n);
	}, r = Bi(t, "noun", 3, "rows"), i = /* @__PURE__ */ O(() => jo(t.rows.map((e) => t.sub?.(e) ?? !1))), a = /* @__PURE__ */ O(() => (z(i).at(-1) ?? -1) + 1), o = /* @__PURE__ */ O(() => Ls(t.key, z(a))), s = /* @__PURE__ */ O(() => t.rows.filter((e, t) => {
		let n = z(i)[t] ?? 0;
		return n >= z(o).first && n < z(o).last;
	}));
	var c = Ks(), l = N(c), u = (e) => {
		var r = H(), i = N(r), o = (e) => {
			var r = Vs(), i = M(r);
			Gr(i, () => t.heading);
			var a = F(i, 2);
			n(a), T(r), U(e, r);
		}, s = (e) => {
			var n = H();
			Gr(N(n), () => t.heading), U(e, n);
		};
		G(i, (e) => {
			z(a) > Ao[0] ? e(o) : e(s, -1);
		}), U(e, r);
	};
	G(l, (e) => {
		t.heading && e(u);
	});
	var d = F(l, 2);
	Gr(d, () => t.intro ?? v);
	var f = F(d, 2), p = M(f), m = (e) => {
		n(e);
	};
	G(p, (e) => {
		t.heading || e(m);
	});
	var h = F(p, 2), g = (e) => {
		var n = Hs(), r = P(n, !0);
		I(() => W(r, t.empty)), U(e, n);
	}, _ = (e) => {
		var n = Gs(), r = M(n), i = M(r);
		K(i, 21, () => t.columns, (e) => e.label, (e, t) => {
			var n = Us(), r = P(n, !0);
			I(() => {
				fi(n, 1, oi(z(t).numeric ? "num" : void 0)), q(n, "title", z(t).title), W(r, z(t).label);
			}), U(e, n);
		}), T(i), T(r);
		var a = F(r);
		K(a, 21, () => z(s), (e) => t.rowKey(e), (e, n) => {
			var r = Ws();
			Gr(M(r), () => t.cells, () => z(n)), T(r), I((e) => fi(r, 1, e), [() => oi([t.sub?.(z(n)) ? "sub-row" : t.group?.(z(n)) ? "group-row" : void 0, t.rowClass?.(z(n))])]), U(e, r);
		}), T(a), T(n), I(() => q(n, "aria-labelledby", t.labelledby)), U(e, n);
	};
	G(h, (e) => {
		t.rows.length === 0 && t.empty !== void 0 ? e(g) : e(_, -1);
	}), T(f), I(() => q(f, "id", t.id)), U(e, c), D();
}
//#endregion
//#region src/components/XLabels.svelte
var Js = /* @__PURE__ */ V([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4);
function Ys(e, t) {
	E(t, !0);
	var n = H();
	K(N(n), 16, () => Yi(t.count, t.most), (e) => e, (e, n) => {
		var r = Js(), i = P(r, !0);
		I((e, n) => {
			q(r, "x", e), q(r, "y", t.y), W(i, n);
		}, [() => t.xOf(n), () => t.text(n)]), U(e, r);
	}), U(e, n), D();
}
//#endregion
//#region src/components/YAxis.svelte
var Xs = /* @__PURE__ */ V([["line", { "stroke-width": "1" }], [
	"text",
	{
		"text-anchor": "end",
		class: "axis-text"
	},
	" "
]], 5);
function Zs(e, t) {
	E(t, !0);
	var n = H();
	K(N(n), 18, () => t.values, (e) => e, (e, n, r) => {
		let i = /* @__PURE__ */ O(() => Xi(t.yOf(n)));
		var a = Xs(), o = N(a), s = F(o), c = P(s, !0);
		I((e) => {
			q(o, "x1", t.left), q(o, "x2", t.right), q(o, "y1", z(i)), q(o, "y2", z(i)), q(o, "stroke", z(r) === 0 ? "var(--axis)" : "var(--grid)"), q(s, "x", t.left - 8), q(s, "y", z(i) + 4), W(c, e);
		}, [() => t.format(n)]), U(e, a);
	}), U(e, n), D();
}
//#endregion
//#region src/components/ByModel.svelte
var Qs = /* @__PURE__ */ V([[
	"button",
	{ type: "button" },
	" "
]]), $s = /* @__PURE__ */ V([["div", {
	class: "segmented",
	role: "group",
	"aria-label": "Metric"
}]]), ec = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), tc = /* @__PURE__ */ V([[
	"span",
	{ class: "legend-group" },
	[
		"strong",
		null,
		" "
	],
	" ",
	,
]]), nc = /* @__PURE__ */ V([[
	"div",
	{ class: "legend" },
	,
]]), rc = /* @__PURE__ */ V([[
	"pattern",
	{
		width: "6",
		height: "6",
		patternUnits: "userSpaceOnUse"
	},
	["rect", {
		width: "6",
		height: "6"
	}],
	["rect", {
		width: "2",
		height: "6"
	}]
]], 4), ic = /* @__PURE__ */ V([["defs"]], 4), ac = /* @__PURE__ */ V([["path"]], 4), oc = /* @__PURE__ */ V([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), sc = /* @__PURE__ */ V([
	,
	,
	,
], 5), cc = /* @__PURE__ */ V([
	,
	,
	,
	,
	,
], 5), lc = /* @__PURE__ */ V([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), uc = /* @__PURE__ */ V([[
	"div",
	{ class: "tip-line tip-effort" },
	[
		"span",
		null,
		,
		" "
	],
	" ",
	[
		"span",
		{ class: "tip-value" },
		" "
	]
]]), dc = /* @__PURE__ */ V([
	[
		"div",
		{ class: "tip-line tip-model" },
		[
			"span",
			null,
			" "
		],
		[
			"span",
			{ class: "tip-value" },
			" "
		]
	],
	" ",
	,
], 1), fc = /* @__PURE__ */ V([[
	"div",
	{ class: "name" },
	"No usage"
]]), pc = /* @__PURE__ */ V([[
	"div",
	{ class: "tip-line tip-total" },
	[
		"span",
		null,
		"Total"
	],
	[
		"span",
		{ class: "tip-value" },
		" "
	]
]]), mc = /* @__PURE__ */ V([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	,
], 1), hc = /* @__PURE__ */ V([[
	"div",
	{ class: "chart" },
	,
]]), gc = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), _c = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function vc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = $s();
		K(t, 20, () => lo, (e) => e, (e, t) => {
			var n = Qs(), r = P(n, !0);
			I(() => {
				q(n, "aria-pressed", z(s) === t), W(r, co[t].label);
			}), B("click", n, () => _(t)), U(e, n);
		}), T(t), U(e, t);
	}, r = (e) => {
		var t = nc(), n = M(t), r = (e) => {
			var t = H();
			K(N(t), 17, () => So(z(c).series), (e) => e.model, (e, t) => {
				var n = tc(), r = M(n), i = P(r, !0);
				K(F(r, 2), 17, () => z(t).entries, ({ entry: e, text: t }) => e.key, (e, t) => {
					let n = () => z(t).entry, r = () => z(t).text;
					var i = ec(), a = M(i);
					{
						let e = /* @__PURE__ */ O(() => ma(n().color, n().hatch, n().turn));
						Ds(a, { get fill() {
							return z(e);
						} });
					}
					var o = F(a, 1, !0);
					T(i), I(() => W(o, r())), U(e, i);
				}), T(n), I(() => W(i, z(t).model)), U(e, n);
			}), U(e, t);
		};
		G(n, (e) => {
			z(c) && e(r);
		}), T(t), U(e, t);
	}, i = (e) => {
		var t = hc(), n = M(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ O(() => mo(t(), z(a).length)), r = /* @__PURE__ */ O(() => Ua(z(c).totals));
				var s = cc(), l = N(s), d = (e) => {
					var t = ic();
					K(t, 21, () => z(u).patterns, ({ id: e, entry: t }) => e, (e, t) => {
						let n = () => z(t).id, r = () => z(t).entry;
						var i = rc(), a = M(i), o = F(a);
						T(i), I(() => {
							q(i, "id", n()), q(i, "patternTransform", `rotate(${r().turn ?? ""})`), q(a, "fill", r().color), q(o, "fill", r().hatch);
						}), U(e, i);
					}), T(t), U(e, t);
				};
				G(l, (e) => {
					z(u).patterns.length && e(d);
				});
				var p = F(l);
				{
					let e = /* @__PURE__ */ O(() => Ia(z(f), 4));
					Zs(p, {
						get left() {
							return 56;
						},
						get right() {
							return z(n).right;
						},
						get values() {
							return z(e);
						},
						yOf: (e) => 220 - 220 * e / z(f),
						get format() {
							return z(o);
						}
					});
				}
				var m = F(p);
				{
					let e = /* @__PURE__ */ O(() => 238);
					Ys(m, {
						get count() {
							return z(a).length;
						},
						xOf: (e) => 56 + z(n).band * (e + .5),
						get y() {
							return z(e);
						},
						text: (e) => z(i).short(z(a)[e] ?? "")
					});
				}
				K(F(m), 18, () => z(a), (e) => e, (e, i, s) => {
					let l = /* @__PURE__ */ O(() => go(t(), z(a).length, z(s)));
					var d = sc(), p = N(d);
					K(p, 17, () => _o(z(c).series, i, z(f)), ({ entry: e, segment: t }) => e.key, (e, t) => {
						let r = () => z(t).entry, i = () => z(t).segment;
						var a = ac();
						I((e, t) => {
							q(a, "d", e), q(a, "fill", t);
						}, [() => Ha(z(l), i().y, z(n).barWidth, i().height, i().top), () => z(u).fill(r())]), U(e, a);
					});
					var m = F(p), h = (e) => {
						let t = /* @__PURE__ */ O(() => z(c).totals[z(s)] ?? 0);
						var r = oc(), i = P(r, !0);
						I((e) => {
							q(r, "x", z(l) + z(n).barWidth / 2), q(r, "y", 220 - 220 * z(t) / z(f) - 6), W(i, e);
						}, [() => z(o)(z(t))]), U(e, r);
					};
					G(m, (e) => {
						z(s) === z(r) && (z(c).totals[z(s)] ?? 0) > 0 && e(h);
					}), U(e, d);
				}), U(e, s);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ O(() => mo(t(), z(a).length).band);
				var i = lc();
				I(() => {
					q(i, "x", 56 + z(r) * n()), q(i, "width", z(r)), q(i, "height", 220);
				}), U(e, i);
			}, r = (e, t = v) => {
				let n = /* @__PURE__ */ O(() => z(a)[t()] ?? ""), r = /* @__PURE__ */ O(() => Co(z(c).series, z(n)));
				var s = mc(), l = N(s), u = P(l, !0), d = F(l, 2);
				K(d, 17, () => z(r), (e) => e.model, (e, t) => {
					var n = dc(), r = N(n), i = M(r), a = P(i, !0), s = P(F(i), !0);
					T(r), K(F(r, 2), 17, () => z(t).efforts, ({ entry: e, text: t, value: n }) => e.key, (e, t) => {
						let n = () => z(t).entry, r = () => z(t).text, i = () => z(t).value;
						var a = uc(), s = M(a), c = M(s);
						{
							let e = /* @__PURE__ */ O(() => ma(n().color, n().hatch, n().turn));
							Ds(c, { get fill() {
								return z(e);
							} });
						}
						var l = F(c, 1, !0);
						T(s);
						var u = P(F(s, 2), !0);
						T(a), I((e) => {
							W(l, r()), W(u, e);
						}, [() => z(o)(i())]), U(e, a);
					}), I((e) => {
						W(a, z(t).model), W(s, e);
					}, [() => z(o)(z(t).value)]), U(e, n);
				}, (e) => {
					U(e, fc());
				});
				var f = F(d, 2), p = (e) => {
					var n = pc(), r = P(F(M(n)), !0);
					T(n), I((e) => W(r, e), [() => z(o)(z(c).totals[t()] ?? 0)]), U(e, n);
				};
				G(f, (e) => {
					z(r).length > 1 && e(p);
				}), I((e) => W(u, e), [() => z(i).long(z(n))]), U(e, s);
			}, i = /* @__PURE__ */ O(() => z(c).buckets), a = /* @__PURE__ */ O(() => z(i).keys), o = /* @__PURE__ */ O(() => z(c).metric.format);
			{
				let i = /* @__PURE__ */ O(() => yo(z(c).metric, z(l)));
				Ss(e, {
					get height() {
						return fo;
					},
					get label() {
						return z(i);
					},
					get width() {
						return z(h);
					},
					get containerWidth() {
						return z(m);
					},
					get cursor() {
						return z(g);
					},
					get plot() {
						return t;
					},
					get marks() {
						return n;
					},
					get tip() {
						return r;
					}
				});
			}
		};
		G(n, (e) => {
			z(c) && z(u) && e(r);
		}), T(t), Fi(t, "clientWidth", (e) => j(m, e)), U(e, t);
	}, a = (e) => {
		var t = H(), n = N(t), r = (e) => {
			let t = (e, t = v) => {
				var r = _c(), i = N(r), a = P(i, !0);
				K(F(i, 2), 18, () => z(n).others, (e) => e, (e, n, r) => {
					var i = gc(), a = P(i, !0);
					I(() => W(a, t().cells[z(r) + 1])), U(e, i);
				}), I(() => W(a, t().cells[0])), U(e, r);
			}, n = /* @__PURE__ */ O(() => {
				let [e = "", ...t] = z(p).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let r = /* @__PURE__ */ O(() => [{ label: z(n).first }, ...z(n).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				qs(e, {
					key: "chart-table",
					get columns() {
						return z(r);
					},
					get rows() {
						return z(p).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return t;
					}
				});
			}
		};
		G(n, (e) => {
			z(p) && e(r);
		}), U(e, t);
	}, o = /* @__PURE__ */ O(() => Q.summary), s = /* @__PURE__ */ A(Qt(uo(fs("metric")))), c = /* @__PURE__ */ O(() => z(o) ? po(z(o), z(s)) : null), l = /* @__PURE__ */ O(() => z(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ O(() => z(c) ? vo(z(c).series) : null), d = /* @__PURE__ */ O(() => z(o) ? z(l) === "hour" ? $("Per hour, by model and effort") : $("Per day, by model and effort") : $("Per day, by model")), f = /* @__PURE__ */ O(() => Fa(Math.max(...z(c)?.totals ?? [], 0))), p = /* @__PURE__ */ O(() => z(c) ? wo(z(c)) : null), m = /* @__PURE__ */ A(0), h = /* @__PURE__ */ O(() => Wi(z(m))), g = /* @__PURE__ */ O(() => z(c) ? {
		count: z(c).buckets.keys.length,
		label: bo(z(c).metric, z(l)),
		valueText: (e) => xo(z(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: mo(e, z(c).buckets.keys.length).right - 56,
			height: 220
		}),
		indexAt: (e) => ho(e, z(c).buckets.keys.length),
		tipX: (e, t) => 56 + mo(e, z(c).buckets.keys.length).band * (t + .5)
	} : null);
	function _(e) {
		j(s, e, !0), ps("metric", e);
	}
	Ts(e, {
		id: "chart",
		get title() {
			return z(d);
		},
		get controls() {
			return n;
		},
		get legend() {
			return r;
		},
		get chart() {
			return i;
		},
		get table() {
			return a;
		}
	}), D();
}
Tr(["click"]);
//#endregion
//#region src/lib/costly.ts
var yc = [{
	label: "Cache reads",
	color: "var(--split-soft)",
	value: (e) => ao(e).cacheRead
}, {
	label: "Everything else",
	color: "var(--split-strong)",
	note: "new input, cache writes, output and web searches",
	value: (e) => ao(e).rest
}];
function bc(e) {
	return e.note ? `${e.label} (${e.note})` : e.label;
}
function xc(e) {
	return e.title || "Untitled session";
}
function Sc(e) {
	return `#session/${encodeURIComponent(e.session_id)}`;
}
function Cc(e) {
	let t = oo(e);
	return e.map((e) => {
		let n = xc(e), r = yc.map((t) => ({
			part: t,
			amount: t.value(e)
		})), i = r.map(({ part: e, amount: t }) => `${e.label} ${X(t)}`).join(", ");
		return {
			session: e,
			title: n,
			href: Sc(e),
			detail: `${e.project} · ${Y(e.turns)} turns · avg context ${J(e.context_avg)}`,
			share: so(e.cost, t),
			cost: X(e.cost),
			parts: r,
			label: `${n}: ${X(e.cost)}; ${i}`
		};
	});
}
function wc(e) {
	let { session: t } = e;
	return {
		title: e.title,
		parts: e.parts.map(({ part: e, amount: n }) => ({
			label: e.label,
			color: e.color,
			amount: X(n),
			share: Ca(n, t.cost || 0)
		})),
		total: e.cost,
		context: `${Y(t.turns)} turns · context avg ${J(t.context_avg)}, peak ${J(t.context_peak)}`
	};
}
function Tc(e) {
	return {
		head: [
			{ label: "Session" },
			{
				label: "Turns",
				numeric: !0
			},
			{
				label: "Avg context",
				numeric: !0
			},
			{
				label: "Peak context",
				numeric: !0
			},
			...yc.map((e) => ({
				label: e.label,
				numeric: !0
			})),
			{
				label: "Cost",
				numeric: !0
			}
		],
		rows: e.map((e) => ({
			key: e.session_id,
			session: e,
			cells: [
				Y(e.turns),
				J(e.context_avg),
				J(e.context_peak),
				...yc.map((t) => X(t.value(e))),
				X(e.cost)
			]
		}))
	};
}
//#endregion
//#region src/components/CostPerSession.svelte
var Ec = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), Dc = /* @__PURE__ */ V([[
	"div",
	{ class: "legend" },
	,
]]), Oc = /* @__PURE__ */ V([["span"]]), kc = /* @__PURE__ */ V([[
	"a",
	{ class: "bar-row" },
	[
		"span",
		{ class: "bar-name" },
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			{ class: "sub" },
			" "
		]
	],
	" ",
	[
		"span",
		{ class: "bar-track" },
		["div", { class: "bar" }]
	],
	" ",
	[
		"span",
		{ class: "bar-value" },
		" "
	]
]]), Ac = /* @__PURE__ */ V([[
	"div",
	{ class: "row" },
	,
	[
		"strong",
		null,
		" "
	],
	[
		"span",
		{ class: "name" },
		" "
	]
]]), jc = /* @__PURE__ */ V([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "row" },
		,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			{ class: "name" },
			"total"
		]
	],
	" ",
	[
		"div",
		{ class: "name" },
		" "
	]
], 1), Mc = /* @__PURE__ */ V([
	["div", { class: "bars" }],
	" ",
	,
], 1), Nc = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	"No sessions in this range."
]]), Pc = /* @__PURE__ */ V([[
	"div",
	{ class: "chart" },
	,
]]), Fc = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Ic = /* @__PURE__ */ V([
	[
		"td",
		null,
		[
			"a",
			null,
			" "
		],
		[
			"span",
			{ class: "sub" },
			" "
		]
	],
	" ",
	,
], 1);
function Lc(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Dc(), n = M(t), r = (e) => {
			var t = H();
			K(N(t), 17, () => yc, (e) => e.label, (e, t) => {
				var n = Ec(), r = M(n);
				Ds(r, { get fill() {
					return z(t).color;
				} });
				var i = F(r, 1, !0);
				T(n), I((e) => W(i, e), [() => bc(z(t))]), U(e, n);
			}), U(e, t);
		};
		G(n, (e) => {
			z(a) && e(r);
		}), T(t), U(e, t);
	}, r = (e) => {
		var t = Pc(), n = M(t), r = (e) => {
			var t = H(), n = N(t), r = (e) => {
				var t = Mc(), n = N(t);
				K(n, 21, () => z(s), (e) => e.session.session_id, (e, t) => {
					var n = kc(), r = M(n), i = M(r), a = P(i, !0), o = P(F(i), !0);
					T(r);
					var s = F(r, 2), c = M(s);
					let l;
					K(c, 21, () => z(t).parts, ({ part: e, amount: t }) => e.label, (e, t) => {
						let n = () => z(t).part, r = () => z(t).amount;
						var i = H(), a = N(i), o = (e) => {
							var t = Oc();
							let i;
							I(() => i = mi(t, "", i, {
								"flex-grow": r(),
								background: n().color
							})), U(e, t);
						};
						G(a, (e) => {
							r() > 0 && e(o);
						}), U(e, i);
					}), T(c), T(s);
					var u = P(F(s, 2), !0);
					T(n), I((e) => {
						q(n, "href", z(t).href), q(n, "aria-label", z(t).label), W(a, z(t).title), W(o, z(t).detail), l = mi(c, "", l, { width: e }), W(u, z(t).cost);
					}, [() => `${z(t).share.toFixed(2) ?? ""}%`]), B("pointermove", n, (e) => p(e, z(t).session.session_id)), wr("focus", n, (e) => p(e, z(t).session.session_id)), wr("pointerleave", n, m), wr("blur", n, m), U(e, n);
				}), T(n);
				var r = F(n, 2), i = (e) => {
					ys(e, {
						get anchor() {
							return z(u).anchor;
						},
						get top() {
							return z(u).top;
						},
						children: (e, t) => {
							var n = jc(), r = N(n), i = P(r, !0), a = F(r, 2);
							K(a, 17, () => z(f).parts, (e) => e.label, (e, t) => {
								var n = Ac(), r = M(n);
								Ds(r, { get fill() {
									return z(t).color;
								} });
								var i = F(r), a = P(i, !0), o = P(F(i));
								T(n), I(() => {
									W(a, z(t).amount), W(o, `${z(t).label ?? ""} · ${z(t).share ?? ""}`);
								}), U(e, n);
							});
							var o = F(a, 2), s = M(o);
							Ds(s, { fill: null });
							var c = P(F(s), !0);
							je(), T(o);
							var l = P(F(o, 2), !0);
							I(() => {
								W(i, z(f).title), W(c, z(f).total), W(l, z(f).context);
							}), U(e, n);
						},
						$$slots: { default: !0 }
					});
				};
				G(r, (e) => {
					z(u) && z(f) && e(i);
				}), U(e, t);
			}, i = (e) => {
				U(e, Nc());
			};
			G(n, (e) => {
				z(s).length ? e(r) : e(i, -1);
			}), U(e, t);
		};
		G(n, (e) => {
			z(a) && e(r);
		}), T(t), U(e, t);
	}, i = (e) => {
		var t = H(), n = N(t), r = (e) => {
			let t = (e, t = v) => {
				var r = Ic(), i = N(r), a = M(i), o = P(a, !0), s = P(F(a), !0);
				T(i), K(F(i, 2), 19, () => z(n), (e) => e.label, (e, n, r) => {
					var i = Fc(), a = P(i, !0);
					I(() => W(a, t().cells[z(r)])), U(e, i);
				}), I((e, n) => {
					q(a, "href", e), W(o, n), W(s, t().session.project);
				}, [() => Sc(t().session), () => xc(t().session)]), U(e, r);
			}, n = /* @__PURE__ */ O(() => z(c).head.slice(1));
			qs(e, {
				key: "costly-table",
				get columns() {
					return z(c).head;
				},
				get rows() {
					return z(c).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		G(n, (e) => {
			z(a) && e(r);
		}), U(e, t);
	}, a = /* @__PURE__ */ O(() => Q.summary), o = /* @__PURE__ */ O(() => z(a)?.costly_sessions ?? []), s = /* @__PURE__ */ O(() => Cc(z(o))), c = /* @__PURE__ */ O(() => Tc(z(o))), l = /* @__PURE__ */ O(() => $("Cost per session")), u = /* @__PURE__ */ A(null), d = /* @__PURE__ */ O(() => z(u) ? z(s).find((e) => e.session.session_id === z(u)?.id) : void 0), f = /* @__PURE__ */ O(() => z(d) ? wc(z(d)) : null);
	function p(e, t) {
		let n = e.currentTarget, r = n.closest(".chart")?.getBoundingClientRect();
		if (!r) return;
		let i = n.getBoundingClientRect(), a = "clientX" in e ? e.clientX : 0;
		j(u, {
			id: t,
			anchor: a ? a - r.left : i.left - r.left + i.width / 2,
			top: n.offsetTop + n.offsetHeight + 4
		}, !0);
	}
	function m() {
		j(u, null);
	}
	Ts(e, {
		id: "costly",
		get title() {
			return z(l);
		},
		note: "the costliest sessions by what they used in the range, with their subagents",
		get legend() {
			return n;
		},
		get chart() {
			return r;
		},
		get table() {
			return i;
		}
	}), D();
}
Tr(["pointermove"]);
//#endregion
//#region src/lib/compact.ts
var Rc = /* @__PURE__ */ t({
	COMPACTION_VERDICTS: () => Yc,
	PAYOFF_WORDS: () => zc,
	REBUILD_CAUSES: () => Jc,
	VERSUS_KEEPING_NOTE: () => Xc,
	breakevenCall: () => $c,
	breakevenText: () => el,
	compactCallKind: () => Wc,
	compactionTotal: () => qc,
	delegateCallShown: () => Gc,
	oneTimeText: () => tl,
	oneTimeTitle: () => nl,
	payoffAhead: () => Hc,
	payoffText: () => Uc,
	payoffTone: () => Vc,
	spread: () => Bc,
	verdictText: () => Zc,
	verdictTitle: () => rl,
	verdictTone: () => Kc,
	verdictWords: () => Qc
}), zc = {
	soon: "Soon",
	close: "Close",
	later: "Not yet",
	unlikely: "Likely too late"
};
function Bc(e, t) {
	return e === t ? "" : ` (${e}–${t})`;
}
function Vc(e, t) {
	let n = e.calls_ahead, r = e.breakeven_calls;
	if (t) {
		if (e.cold_saving >= 0) return "soon";
		r = e.breakeven_cold;
	}
	return r !== null && n != null && r <= n ? r <= n / 2 ? "soon" : "close" : (e.pays_later_in ?? null) === null ? r === null ? "unlikely" : n == null ? null : "unlikely" : "later";
}
function Hc(e, t, n) {
	if (!e || t.calls_ahead === null || t.calls_ahead === void 0) return null;
	if (e === "later") {
		let e = t.pays_later_in === 1 ? "1 reply" : `${Y(t.pays_later_in)} replies`;
		return `${zc.later}: growing at its recent pace, the context reaches about ${J(t.pays_later_at)} in ${e}, and compacting then would pay off within the replies still ahead on average.`;
	}
	if ((n ? t.cold_saving >= 0 ? null : t.breakeven_cold : t.breakeven_calls) === null) return null;
	let r = Y(Math.round(t.calls_ahead));
	return `${zc[e]}: ` + (t.ahead_from === "longer" ? `after your past compactions, a stretch this long went on for about ${r} more replies on average.` : `after your past compactions you went on for about ${r} replies on average.`);
}
function Uc(e, t) {
	let n = (e.pays_later_in ?? null) === null ? "would never pay off" : "would not pay off yet";
	if (t) return e.breakeven_cold === null ? `${n}: the context is below what compacting leaves` : e.cold_saving >= 0 ? `pays off at once (about ${X(e.cold_saving)}), since the next reply sends it all anyway` : `would pay off after about ${Y(e.breakeven_cold)} replies`;
	let r = (e) => e === null ? "never" : Y(e);
	return e.breakeven_calls === null ? e.breakeven_low === null ? `${n}: the context is below what compacting leaves` : `would likely not pay off (at best after about ${Y(e.breakeven_low)} replies)` : `would pay off after about ${Y(e.breakeven_calls)} replies` + Bc(r(e.breakeven_low), r(e.breakeven_high));
}
function Wc(e, t) {
	let n = e.live ? e.current : null, r = n ? n.compact_now : null;
	if (!n || !r) return null;
	let i = n.context >= n.hint_tokens ? "threshold" : null, a = r.estimate, o = r.cache_warm_until;
	return a && o !== null && Date.parse(o) < Date.parse(t) && a.cold_saving >= 0 ? "cold" : i;
}
function Gc(e) {
	let t = e.live ? e.current : null, n = t ? t.exploration : null, r = t && t.compact_now ? t.compact_now.estimate : null;
	return !n || !r || r.calls_ahead === null || r.calls_ahead === void 0 ? !1 : n.tokens >= e.delegate_hint_tokens && r.calls_ahead >= e.delegate_calls_ahead;
}
function Kc(e) {
	return e.verdict === "saved" ? "gain" : e.verdict === "cost_more" || e.verdict === "open" && (e.net ?? 0) < 0 ? "loss" : null;
}
function qc(e) {
	let t = e.map((e) => e.versus_keeping).filter((e) => e !== null && e.verdict !== "forced");
	if (!t.length) return null;
	let n = t.map((e) => e.net).filter((e) => e !== null);
	return {
		net: n.reduce((e, t) => e + t, 0),
		compactions: n.length,
		unknown: t.length - n.length
	};
}
var Jc = {
	model: "the model changed",
	idle: "the cache expired while idle",
	prefix: "something early in the context changed"
}, Yc = {
	saved: "saved",
	cost_more: "cost more",
	even: "about even",
	forced: "forced: keeping would have auto-compacted",
	open: "not paid off by the last call",
	unknown: "unknown without an output speed or duration"
}, Xc = "Compared with keeping the context: the same later calls, each reading the dropped tokens again from the cache, at API list prices. ~ marks the summary call's output, estimated from its duration at your output speed; ▲ + (saved, green) holds even at your fastest, ▼ − (cost more, red) even without the summary, or so far for the stretch still running. Re-reading files after compacting isn't counted.";
function Zc(e) {
	let { verdict: t, net: n, net_high: r } = e;
	return t === "saved" ? `▲ +${X(n)}` : t === "cost_more" ? n === null ? `▼ −${X(-r)} or more` : `▼ −${X(-n)}` : t === "open" && n !== null ? n < 0 ? `▼ −${X(-n)} so far` : "about even so far" : t === "unknown" && r > 0 ? `saved at most ${X(r)}, the summary call unknown` : Yc[t];
}
function Qc(e) {
	let t = Kc(e);
	return t === "gain" ? "Saved against keeping the context" : e.verdict === "open" ? "Not paid off by the last call: cost more than keeping the context so far" : t === "loss" ? "Cost more than keeping the context" : null;
}
function $c(e) {
	return e.verdict === "forced" ? null : e.breakeven_call === null ? "never" : `${e.breakeven_at_least ? "≥ " : ""}call ${Y(e.breakeven_call)}`;
}
function el(e) {
	let t = $c(e);
	return t === null ? null : t === "never" ? "never pays off" : e.breakeven_at_least ? `pays off at call ${Y(e.breakeven_call)} or later` : (e.breakeven_call ?? 0) > e.calls_after ? `would pay off at ${t}` : `paid off at ${t}`;
}
function tl(e) {
	return e.one_time === null ? `≥ ${X(e.call_low + e.rewrite)}` : `~${X(e.one_time)}`;
}
function nl(e) {
	let t = e.summary_tokens === null ? "its summary unknown" : `a summary of about ${J(e.summary_tokens)} tokens, at most ${J(e.summary_high)}`, n = e.cache_warm ? "warm" : "cold";
	return `The summary call ${e.call_cost === null ? "" : `~${X(e.call_cost)} `}(${t}; input ${X(e.call_low)}, cache ${n}) and rewriting the next call's context ` + X(e.rewrite);
}
function rl(e) {
	let t = [];
	return e.rework_margin !== null && t.push(`Re-reading about ${J(e.rework_margin)} tokens after compacting would cancel the saving`), e.capped_at !== null && t.push(`The kept session would have auto-compacted at call ${Y(e.capped_at)}`), t.join(". ") || null;
}
//#endregion
//#region src/lib/live.ts
var il = /* @__PURE__ */ t({
	liveCompactBadge: () => ul,
	liveEmpty: () => sl,
	livePastDay: () => al,
	liveSecretBadge: () => ll,
	liveStateBadges: () => dl,
	liveWaitBadge: () => cl,
	liveWindow: () => ol,
	sessionWaits: () => fl,
	waitChanged: () => pl
});
function al(e, t) {
	return e.days === 1 && e.until && e.until !== t ? e.until : null;
}
function ol(e, t) {
	let n = al(e, t), r = e.agent_minutes > e.minutes ? ` (${e.agent_minutes} min while agents work)` : "", i = e.sessions.some((e) => e.waiting) ? " or waiting for you" : "", a = n ? `, active on ${Oa(n)}` : "";
	return `· changed in the last ${e.minutes} min${r}${i}${a}`;
}
function sl(e, t) {
	let n = al(e, t);
	return n ? `No live session was active on ${Oa(n)}.` : `No session active in the last ${e.minutes} minutes.`;
}
function cl(e) {
	if (!e) return null;
	let t = ` since ${Z(e.since)}`;
	if (e.kind === "permission") {
		let n = e.agent_type ? ` (a ${e.agent_type} subagent)` : "";
		return {
			kind: "permission",
			tone: "waiting",
			text: `Waiting for your permission to use ${e.tool}${n}${t}`
		};
	}
	return {
		kind: "waiting",
		tone: "waiting",
		text: `Waiting for ${e.tool === "ExitPlanMode" ? "you to approve the plan" : "your answer"}${t}`
	};
}
function ll(e) {
	let t = e.high ?? 0, n = e.medium ?? 0;
	if (!t && !n) return null;
	let r = (e) => e === 1 ? "1 call" : `${Y(e)} calls`, i = t ? `${r(t)} sent out${n ? `, ${Y(n)} more returned a result or may still` : ""}` : `${r(n)} returned a result or may still`;
	return {
		kind: "secret",
		tone: t ? "high" : "medium",
		text: `Possible secret access: ${i}`
	};
}
function ul(e, t) {
	let n = e ? e.compact_now : null;
	if (!e || !n) return null;
	let r = e.context >= e.hint_tokens ? `Past your ${J(e.hint_tokens)} compact hint.` : null, i = r ? ["hint"] : [], a = () => r ? {
		kind: "compact",
		tone: null,
		text: r,
		states: i
	} : null, o = n.estimate;
	if (!o) return a();
	let s = n.cache_warm_until, c = s !== null && Date.parse(s) < Date.parse(t), l = Vc(o, c), u = (e, t) => ({
		kind: "compact",
		tone: l,
		text: [t, r].filter(Boolean).join(" "),
		states: [e, ...i]
	});
	if (Wc({
		live: !0,
		current: e
	}, t) === "cold") return u("cold", `Compacting now saves ~${X(o.cold_saving)} at once: the cache has expired.`);
	if (l === "later") return a();
	let d = c ? o.breakeven_cold : o.breakeven_calls, f = o.calls_ahead ?? null, p = o.calls_after_high ?? null;
	if (f === null && (d === null || p === null || d > p)) return a();
	if (d === null) return c || o.breakeven_low === null ? a() : u("unlikely", "Compacting now would likely not pay off.");
	let m = `pays off after ~${Y(d)} replies`;
	return !l || f === null ? u("pays", `Compacting now ${m}.`) : u(l, `${zc[l]}: compacting now ${m}, ~${Y(Math.round(f))} ahead on average.`);
}
function dl(e, t) {
	return [ll(e.secrets), ul(e.current, t)].filter((e) => e !== null);
}
function fl(e, t) {
	let n = cl(e.waiting), r = n ? [{
		...n,
		session_id: e.session_id,
		title: null
	}] : [], i = [];
	for (let n of t) {
		let t = n.session_id === e.session_id ? null : cl(n.waiting);
		t && i.push({
			...t,
			session_id: n.session_id,
			title: n.title || "Untitled session"
		});
	}
	return [...r, ...i];
}
function pl(e, t) {
	let n = t.find((t) => t.session_id === e.session_id);
	return n !== void 0 && JSON.stringify(n.waiting ?? null) !== JSON.stringify(e.waiting ?? null);
}
//#endregion
//#region src/components/LiveIcon.svelte
var ml = /* @__PURE__ */ V([
	["path", {
		d: "M8 10.5V7.8a4 4 0 0 1 8 0v2.7",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round"
	}],
	["rect", {
		x: "4.8",
		y: "10.5",
		width: "14.4",
		height: "10",
		rx: "2",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6"
	}],
	["circle", {
		cx: "12",
		cy: "14.6",
		r: "1.4",
		fill: "currentColor"
	}],
	["path", {
		d: "M12 15.4v2.4",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round"
	}]
], 5), hl = /* @__PURE__ */ V([
	["path", {
		d: "M5 3.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8.2L6 20.5v-4H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linejoin": "round"
	}],
	["path", {
		d: "M9.7 8.2a2.3 2.3 0 1 1 3.3 2.1c-.6.3-1 .8-1 1.5v.3",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6",
		"stroke-linecap": "round"
	}],
	["circle", {
		cx: "12",
		cy: "14.4",
		r: "1",
		fill: "currentColor"
	}]
], 5), gl = /* @__PURE__ */ V([
	["path", {
		d: "M7.2 9.6 8.6 4.4c.2-.8 1-1.2 1.8-1l1.6.4 1.6-.4c.8-.2 1.6.2 1.8 1l1.4 5.2z",
		fill: "currentColor"
	}],
	["path", {
		d: "M2.8 10.4c0-.7 4.1-1.2 9.2-1.2s9.2.5 9.2 1.2-4.1 1.4-9.2 1.4-9.2-.7-9.2-1.4z",
		fill: "currentColor"
	}],
	["rect", {
		x: "6.2",
		y: "13",
		width: "4.8",
		height: "3",
		rx: "1.3",
		fill: "currentColor"
	}],
	["rect", {
		x: "13",
		y: "13",
		width: "4.8",
		height: "3",
		rx: "1.3",
		fill: "currentColor"
	}],
	["path", {
		d: "M11 14h2",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.4"
	}],
	["path", {
		d: "M4 22.8c.5-2.9 3.6-4.6 8-4.6s7.5 1.7 8 4.6zM10.4 18.4l1.6 2.8 1.6-2.8z",
		fill: "currentColor",
		"fill-rule": "evenodd"
	}]
], 5), _l = /* @__PURE__ */ V([
	["rect", {
		x: "3.5",
		y: "2.5",
		width: "17",
		height: "19",
		rx: "2",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.6"
	}],
	["path", {
		d: "M12 2.5v5.3M9.5 11.6l2.5 1.6 2.5-1.6",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "1.5",
		"stroke-linecap": "round",
		"stroke-linejoin": "round"
	}],
	["rect", {
		x: "6",
		y: "7.8",
		width: "12",
		height: "2.3",
		rx: "0.6",
		fill: "currentColor"
	}],
	["path", {
		d: "M6 19h12v-4.2l-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3z",
		fill: "currentColor"
	}]
], 5), vl = /* @__PURE__ */ V([[
	"span",
	{ role: "img" },
	[
		"svg",
		{
			viewBox: "0 0 24 24",
			"aria-hidden": "true",
			focusable: "false"
		},
		,
	]
]]);
function yl(e, t) {
	E(t, !0);
	var n = vl(), r = M(n), i = M(r), a = (e) => {
		var t = ml();
		je(3), U(e, t);
	}, o = (e) => {
		var t = hl();
		je(2), U(e, t);
	}, s = (e) => {
		var t = gl();
		je(5), U(e, t);
	}, c = (e) => {
		var t = _l();
		je(3), U(e, t);
	};
	G(i, (e) => {
		t.badge.kind === "permission" ? e(a) : t.badge.kind === "waiting" ? e(o, 1) : t.badge.kind === "secret" ? e(s, 2) : e(c, -1);
	}), T(r), T(n), I(() => {
		fi(n, 1, oi([
			"live-icon",
			`live-icon-${t.badge.kind}`,
			t.badge.tone && `live-icon-${t.badge.tone}`
		])), q(n, "aria-label", t.badge.text), q(n, "title", t.badge.text);
	}), U(e, n), D();
}
//#endregion
//#region src/components/LiveCard.svelte
var bl = /* @__PURE__ */ V([[
	"div",
	null,
	[
		"span",
		{ class: "label" },
		" "
	],
	[
		"strong",
		null,
		" "
	]
]]), xl = /* @__PURE__ */ V([[
	"li",
	null,
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "secondary" },
		" "
	],
	[
		"span",
		{ class: "sub muted" },
		" "
	]
]]), Sl = /* @__PURE__ */ V([["ul"]]), Cl = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	"No subagent running"
]]), wl = /* @__PURE__ */ V([[
	"div",
	{ class: "live-card" },
	[
		"div",
		{ class: "live-head" },
		[
			"div",
			{ class: "title" },
			["span", {
				class: "dot",
				"aria-hidden": "true"
			}],
			[
				"a",
				null,
				" "
			]
		],
		" ",
		,
		" ",
		["div", { class: "live-states" }]
	],
	" ",
	[
		"div",
		{ class: "muted" },
		" "
	],
	" ",
	["div", { class: "numbers" }],
	" ",
	,
]]);
function Tl(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => cl(t.session.waiting)), r = /* @__PURE__ */ O(() => t.sessionState ? dl(t.sessionState, new Date(t.now).toISOString()) : []), i = /* @__PURE__ */ O(() => [
		{
			label: "Turns",
			value: Y(t.session.turns)
		},
		{
			label: "Output",
			value: J(t.session.output)
		},
		{
			label: "Last context",
			value: J(t.session.last_context)
		},
		{
			label: "Cost",
			value: X(t.session.cost)
		}
	]);
	var a = wl(), o = M(a), s = M(o), c = F(M(s)), l = P(c, !0);
	T(s);
	var u = F(s, 2), d = (e) => {
		yl(e, { get badge() {
			return z(n);
		} });
	};
	G(u, (e) => {
		z(n) && e(d);
	});
	var f = F(u, 2);
	K(f, 21, () => z(r), (e) => e.kind, (e, t) => {
		yl(e, { get badge() {
			return z(t);
		} });
	}), T(f), T(o);
	var p = F(o, 2), m = P(p), h = F(p, 2);
	K(h, 21, () => z(i), (e) => e.label, (e, t) => {
		var n = bl(), r = M(n), i = P(r, !0), a = P(F(r), !0);
		T(n), I(() => {
			W(i, z(t).label), W(a, z(t).value);
		}), U(e, n);
	}), T(h);
	var g = F(h, 2), _ = (e) => {
		var n = Sl();
		K(n, 21, () => t.session.subagents, (e) => e.agent_id, (e, n) => {
			var r = xl(), i = M(r), a = P(i, !0), o = F(i, 2), s = P(o, !0), c = P(F(o));
			T(r), I((e, t, r) => {
				W(a, z(n).agent_type), W(s, z(n).description || ""), W(c, `${(z(n).model || "–") ?? ""} · ${e ?? ""} turns · context ${t ?? ""} · ${r ?? ""}`);
			}, [
				() => Y(z(n).turns),
				() => J(z(n).last_context),
				() => Ma(z(n).last_activity, t.now)
			]), U(e, r);
		}), T(n), U(e, n);
	}, v = (e) => {
		U(e, Cl());
	};
	G(g, (e) => {
		t.session.subagents.length ? e(_) : e(v, -1);
	}), T(a), I((e, n, r) => {
		q(c, "href", e), W(l, n), W(m, `${t.session.project ?? ""}${t.session.git_branch ? ` · ${t.session.git_branch}` : ""} · ${r ?? ""}`);
	}, [
		() => Sc(t.session),
		() => xc(t.session),
		() => Ma(t.session.last_activity, t.now)
	]), U(e, a), D();
}
//#endregion
//#region src/components/LiveSessions.svelte
var El = /* @__PURE__ */ V([[
	"h2",
	{ id: "live-title" },
	[
		"span",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	]
]]), Dl = /* @__PURE__ */ V([[
	"div",
	{ class: "title-row" },
	,
	" ",
	,
]]), Ol = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), kl = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), Al = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), jl = /* @__PURE__ */ V([["div", { class: "live-grid" }]]), Ml = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), Nl = /* @__PURE__ */ V([
	,
	,
	" ",
	,
	" ",
	,
], 1), Pl = /* @__PURE__ */ V([[
	"section",
	{
		class: "card",
		"aria-labelledby": "live-title"
	},
	,
	" ",
	[
		"div",
		{ class: "paged-wrap" },
		,
	]
]]);
function Fl(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = El(), n = M(t), r = P(n, !0), a = P(F(n, 2), !0);
		T(t), I((e, t) => {
			W(r, e), W(a, t);
		}, [() => $("Live sessions"), () => z(i) ? ol(z(i), z(o)) : ""]), U(e, t);
	}, r = "live", i = /* @__PURE__ */ O(() => Q.live), a = /* @__PURE__ */ O(() => Q.liveAt ?? Date.now()), o = /* @__PURE__ */ O(() => Ea(new Date(z(a)))), s = /* @__PURE__ */ O(() => z(i)?.sessions ?? []), c = /* @__PURE__ */ O(() => jo(z(s).map(() => !1))), l = /* @__PURE__ */ O(() => z(s).length), u = /* @__PURE__ */ O(() => Ls(r, z(l))), d = /* @__PURE__ */ O(() => z(s).slice(z(u).first, z(u).last)), f = /* @__PURE__ */ O(() => z(l) > Ao[0]);
	var p = Pl(), m = M(p), h = (e) => {
		var t = Dl(), i = M(t);
		n(i), Ns(F(i, 2), {
			key: r,
			noun: "sessions",
			get units() {
				return z(c);
			}
		}), T(t), U(e, t);
	}, g = (e) => {
		n(e);
	};
	G(m, (e) => {
		z(f) ? e(h) : e(g, -1);
	});
	var _ = F(m, 2), v = M(_), y = (e) => {
		var t = Ol(), n = P(t, !0);
		I(() => W(n, Q.liveFailed ? "Could not load the live sessions." : "Loading…")), U(e, t);
	}, ee = (e) => {
		var t = Nl(), n = N(t), r = (e) => {
			var t = kl(), n = P(t);
			I(() => W(n, `Permission prompts can't show here: ${z(i).prompts_unavailable ?? ""}.`)), U(e, t);
		};
		G(n, (e) => {
			z(i).prompts_unavailable && e(r);
		});
		var s = F(n, 2), c = (e) => {
			var t = Al(), n = P(t);
			I(() => W(n, `Desktop notifications can't show: ${z(i).notifications_unavailable ?? ""}.`)), U(e, t);
		};
		G(s, (e) => {
			z(i).notifications_unavailable && e(c);
		});
		var l = F(s, 2), u = (e) => {
			var t = jl();
			K(t, 21, () => z(d), (e) => e.session_id, (e, t) => {
				{
					let n = /* @__PURE__ */ O(() => Q.liveState(z(t).session_id));
					Tl(e, {
						get session() {
							return z(t);
						},
						get sessionState() {
							return z(n);
						},
						get now() {
							return z(a);
						}
					});
				}
			}), T(t), U(e, t);
		}, f = (e) => {
			var t = Ml(), n = P(t, !0);
			I((e) => W(n, e), [() => sl(z(i), z(o))]), U(e, t);
		};
		G(l, (e) => {
			z(d).length ? e(u) : e(f, -1);
		}), U(e, t);
	};
	G(v, (e) => {
		z(i) ? e(ee, -1) : e(y);
	}), T(_), T(p), U(e, p), D();
}
//#endregion
//#region src/lib/trend.ts
var Il = [
	{
		label: "Estimated cost",
		slot: 0,
		value: (e) => e.cost,
		format: X
	},
	{
		label: "Input tokens",
		slot: 1,
		value: (e) => e.input,
		format: J
	},
	{
		label: "Output tokens",
		slot: 2,
		value: (e) => e.output,
		format: J
	}
];
function Ll(e) {
	let t = e * 116 + 22;
	return {
		top: t,
		bottom: t + 76
	};
}
function Rl() {
	return Ll(Il.length - 1).bottom + 28;
}
function zl(e, t = /* @__PURE__ */ new Date()) {
	let n = Ga(e, t), r = qa(n.unit === "hour" ? e.hour_model : e.day_model, n.keyOf);
	return {
		buckets: n,
		totals: n.keys.map((e) => r.get(e) ?? Ka)
	};
}
function Bl(e, t) {
	return e.totals.map((e) => t.value(e));
}
function Vl(e) {
	return `estimated cost, input and output tokens per ${e}`;
}
function Hl(e) {
	return `Estimated cost, input tokens and output tokens per ${e}; table view available`;
}
function Ul(e) {
	return `Estimated cost, input and output tokens per ${e}; arrow keys step through them`;
}
function Wl(e, t) {
	let n = e.totals[t] ?? Ka, r = Il.map((e) => `${e.label} ${e.format(e.value(n))}`).join(", ");
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${r}`;
}
function Gl(e) {
	let t = e.buckets.keys.map((t, n) => ({
		key: t,
		cells: [e.buckets.short(t), ...Il.map((t) => t.format(t.value(e.totals[n] ?? Ka)))]
	})).reverse();
	return {
		head: [e.buckets.heading, ...Il.map((e) => e.label)],
		rows: t
	};
}
//#endregion
//#region src/components/AreaLine.svelte
var Kl = /* @__PURE__ */ V([["path", { "fill-opacity": "0.1" }], ["path", {
	fill: "none",
	"stroke-width": "2",
	"stroke-linejoin": "round",
	"stroke-linecap": "round"
}]], 5);
function ql(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => t.values.map((e, n) => `${t.xOf(n).toFixed(1)},${t.yOf(e).toFixed(1)}`).join("L")), r = /* @__PURE__ */ O(() => `M${t.xOf(0)},${t.bottom}L${z(n)}L${t.xOf(t.values.length - 1)},${t.bottom}Z`);
	var i = H(), a = N(i), o = (e) => {
		var i = Kl(), a = N(i), o = F(a);
		I(() => {
			q(a, "d", z(r)), q(a, "fill", t.color), q(o, "d", `M${z(n) ?? ""}`), q(o, "stroke", t.color);
		}), U(e, i);
	};
	G(a, (e) => {
		t.values.length && e(o);
	}), U(e, i), D();
}
//#endregion
//#region src/components/PointDot.svelte
var Jl = /* @__PURE__ */ V([["circle", {
	r: "4",
	stroke: "var(--surface)",
	"stroke-width": "2"
}]], 4);
function Yl(e, t) {
	var n = Jl();
	I(() => {
		q(n, "cx", t.x), q(n, "cy", t.y), q(n, "fill", t.color);
	}), U(e, n);
}
//#endregion
//#region src/components/OverTime.svelte
var Xl = (e, t = v) => {
	var n = au(), r = N(n), i = P(r, !0);
	K(F(r, 2), 19, () => Il, (e) => e.label, (e, n, r) => {
		var i = iu(), a = P(i, !0);
		I(() => W(a, t().cells[z(r) + 1])), U(e, i);
	}), I(() => W(i, t().cells[0])), U(e, n);
}, Zl = /* @__PURE__ */ V([
	,
	,
	[
		"text",
		{ class: "value-text" },
		" "
	]
], 5), Ql = /* @__PURE__ */ V([
	["line", {
		"stroke-width": "2",
		"stroke-linecap": "round"
	}],
	[
		"text",
		{ class: "panel-title" },
		" "
	],
	,
	,
	,
], 5), $l = /* @__PURE__ */ V([
	,
	,
	,
], 5), eu = /* @__PURE__ */ V([["line", { class: "crosshair" }], ,], 5), tu = /* @__PURE__ */ V([[
	"div",
	{ class: "row" },
	["span", { class: "key" }],
	" ",
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "name" },
		" "
	]
]]), nu = /* @__PURE__ */ V([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
], 1), ru = /* @__PURE__ */ V([[
	"div",
	{ class: "chart" },
	,
]]), iu = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), au = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1);
function ou(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = ru(), n = M(t), r = (e) => {
			let t = (e, t = v) => {
				let n = /* @__PURE__ */ O(() => t() - 64), r = /* @__PURE__ */ O(() => Ra(z(s).length, 56, z(n)));
				var a = $l(), o = N(a);
				K(o, 17, () => z(d), ({ panel: e, top: t, bottom: n, color: r, values: i, max: a, yOf: o }) => e.label, (e, t) => {
					let i = () => z(t).panel, a = () => z(t).top, o = () => z(t).bottom, s = () => z(t).color, c = () => z(t).values, l = () => z(t).max, u = () => z(t).yOf;
					var d = Ql(), f = N(d), p = F(f), m = P(p, !0), h = F(p);
					{
						let e = /* @__PURE__ */ O(() => Ia(l(), 2));
						Zs(h, {
							get left() {
								return 56;
							},
							get right() {
								return z(n);
							},
							get values() {
								return z(e);
							},
							get yOf() {
								return u();
							},
							get format() {
								return i().format;
							}
						});
					}
					var g = F(h);
					ql(g, {
						get values() {
							return c();
						},
						get xOf() {
							return z(r);
						},
						get yOf() {
							return u();
						},
						get bottom() {
							return o();
						},
						get color() {
							return s();
						}
					});
					var _ = F(g), v = (e) => {
						let t = /* @__PURE__ */ O(() => c().length - 1), n = /* @__PURE__ */ O(() => c()[z(t)] ?? 0);
						var a = Zl(), o = N(a);
						{
							let e = /* @__PURE__ */ O(() => z(r)(z(t))), i = /* @__PURE__ */ O(() => u()(z(n)));
							Yl(o, {
								get x() {
									return z(e);
								},
								get y() {
									return z(i);
								},
								get color() {
									return s();
								}
							});
						}
						var l = F(o), d = P(l, !0);
						I((e, t, n) => {
							q(l, "x", e), q(l, "y", t), W(d, n);
						}, [
							() => z(r)(z(t)) + 9,
							() => u()(z(n)) + 4,
							() => i().format(z(n))
						]), U(e, a);
					};
					G(_, (e) => {
						c().length && e(v);
					}), I(() => {
						q(f, "x1", 56), q(f, "x2", 70), q(f, "y1", a() - 10), q(f, "y2", a() - 10), q(f, "stroke", s()), q(p, "x", 76), q(p, "y", a() - 6), W(m, i().label);
					}), U(e, d);
				});
				var c = F(o);
				{
					let e = /* @__PURE__ */ O(() => u + 18);
					Ys(c, {
						get count() {
							return z(s).length;
						},
						get xOf() {
							return z(r);
						},
						get y() {
							return z(e);
						},
						text: (e) => z(i).short(z(s)[e] ?? "")
					});
				}
				U(e, a);
			}, n = (e, t = v, n = v) => {
				let r = /* @__PURE__ */ O(() => Ra(z(s).length, 56, t() - 64));
				var i = eu(), a = N(i);
				K(F(a), 17, () => z(d), ({ panel: e, color: t, values: n, yOf: r }) => e.label, (e, t) => {
					let i = () => z(t).color, a = () => z(t).values, o = () => z(t).yOf;
					{
						let t = /* @__PURE__ */ O(() => z(r)(n())), s = /* @__PURE__ */ O(() => o()(a()[n()] ?? 0));
						Yl(e, {
							get x() {
								return z(t);
							},
							get y() {
								return z(s);
							},
							get color() {
								return i();
							}
						});
					}
				}), I((e, t) => {
					q(a, "x1", e), q(a, "x2", t), q(a, "y1", 18), q(a, "y2", u);
				}, [() => z(r)(n()), () => z(r)(n())]), U(e, i);
			}, r = (e, t = v) => {
				var n = nu(), r = N(n), a = P(r, !0);
				K(F(r, 2), 17, () => z(d), ({ panel: e, color: t, values: n }) => e.label, (e, n) => {
					let r = () => z(n).panel, i = () => z(n).color, a = () => z(n).values;
					var o = tu(), s = M(o);
					let c;
					var l = F(s, 2), u = P(l, !0), d = P(F(l, 2), !0);
					T(o), I((e) => {
						c = mi(s, "", c, { background: i() }), W(u, e), W(d, r().label);
					}, [() => r().format(a()[t()] ?? 0)]), U(e, o);
				}), I((e) => W(a, e), [() => z(i).long(z(s)[t()] ?? "")]), U(e, n);
			}, i = /* @__PURE__ */ O(() => z(a).buckets), s = /* @__PURE__ */ O(() => z(i).keys);
			{
				let i = /* @__PURE__ */ O(Rl), a = /* @__PURE__ */ O(() => Hl(z(o)));
				Ss(e, {
					get height() {
						return z(i);
					},
					get label() {
						return z(a);
					},
					get width() {
						return z(l);
					},
					get containerWidth() {
						return z(c);
					},
					get cursor() {
						return z(f);
					},
					get plot() {
						return t;
					},
					get marks() {
						return n;
					},
					get tip() {
						return r;
					}
				});
			}
		};
		G(n, (e) => {
			z(a) && e(r);
		}), T(t), Fi(t, "clientWidth", (e) => j(c, e)), U(e, t);
	}, r = (e) => {
		var t = H(), n = N(t), r = (e) => {
			let t = /* @__PURE__ */ O(() => {
				let [e = "", ...t] = z(s).head;
				return {
					first: e,
					others: t
				};
			});
			{
				let n = /* @__PURE__ */ O(() => [{ label: z(t).first }, ...z(t).others.map((e) => ({
					label: e,
					numeric: !0
				}))]);
				qs(e, {
					key: "trend-table",
					get columns() {
						return z(n);
					},
					get rows() {
						return z(s).rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return Xl;
					}
				});
			}
		};
		G(n, (e) => {
			z(s) && e(r);
		}), U(e, t);
	}, i = /* @__PURE__ */ O(() => Q.summary), a = /* @__PURE__ */ O(() => z(i) ? zl(z(i)) : null), o = /* @__PURE__ */ O(() => z(a)?.buckets.unit ?? "day"), s = /* @__PURE__ */ O(() => z(a) ? Gl(z(a)) : null), c = /* @__PURE__ */ A(0), l = /* @__PURE__ */ O(() => Wi(z(c))), u = Ll(Il.length - 1).bottom, d = /* @__PURE__ */ O(() => z(a) ? Il.map((e, t) => {
		let { top: n, bottom: r } = Ll(t), i = Bl(z(a), e), o = Fa(Math.max(...i, 0));
		return {
			panel: e,
			top: n,
			bottom: r,
			color: la(e.slot),
			values: i,
			max: o,
			yOf: (e) => r - 76 * e / o
		};
	}) : []), f = /* @__PURE__ */ O(() => z(a) ? {
		count: z(a).buckets.keys.length,
		label: Ul(z(o)),
		valueText: (e) => Wl(z(a), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: u
		}),
		indexAt: (e) => za(56, e - 64, z(a).buckets.keys.length),
		tipX: (e, t) => Ra(z(a).buckets.keys.length, 56, e - 64)(t)
	} : null);
	{
		let t = /* @__PURE__ */ O(() => $("Over time")), i = /* @__PURE__ */ O(() => Vl(z(o)));
		Ts(e, {
			id: "trend",
			get title() {
				return z(t);
			},
			get note() {
				return z(i);
			},
			get chart() {
				return n;
			},
			get table() {
				return r;
			}
		});
	}
	D();
}
//#endregion
//#region src/lib/range.ts
var su = /* @__PURE__ */ t({
	RANGES: () => cu,
	dayLabel: () => pu,
	dayStep: () => mu,
	rangeDays: () => lu,
	rangeQuery: () => du,
	shownDay: () => fu,
	visibleRanges: () => uu
}), cu = [
	{
		days: 1,
		label: "Daily"
	},
	{
		days: 7,
		label: "7 days"
	},
	{
		days: 30,
		label: "30 days"
	},
	{
		days: 90,
		label: "90 days"
	},
	{
		days: 365,
		label: "1 year"
	}
];
function lu(e) {
	return cu.some((t) => t.days === e) ? e : null;
}
function uu(e) {
	return e ? cu.filter((t) => t.days <= e) : cu;
}
function du(e, t) {
	return `days=${e}` + (e === 1 && t !== null ? `&until=${t}` : "");
}
function fu(e, t, n) {
	let r = t ?? n;
	return e && e.days === 1 && e.until === r ? e : null;
}
function pu(e) {
	return e === null ? "Today" : Oa(e);
}
function mu(e, t, n) {
	let r = e?.[t];
	if (r) return r === n ? null : r;
}
//#endregion
//#region src/lib/range.svelte.ts
var hu = /* @__PURE__ */ t({
	RangeState: () => _u,
	range: () => vu
});
function gu() {
	return lu(Number(fs("days"))) ?? 30;
}
var _u = class {
	#e = /* @__PURE__ */ A(Qt(gu()));
	#t = /* @__PURE__ */ A(null);
	onchange = null;
	get days() {
		return z(this.#e);
	}
	get day() {
		return z(this.#t);
	}
	select(e) {
		lu(e) !== null && (j(this.#e, e, !0), j(this.#t, null), ps("days", e), this.onchange?.());
	}
	step(e, t) {
		let n = Ea(/* @__PURE__ */ new Date()), r = mu(fu(t, z(this.#t), n), e, n);
		r !== void 0 && (j(this.#t, r, !0), this.onchange?.());
	}
	fit(e) {
		e.days >= z(this.#e) || (j(this.#e, e.days, !0), ps("days", e.days));
	}
	reset() {
		j(this.#e, gu(), !0), j(this.#t, null), this.onchange = null;
	}
}, vu = new _u(), yu = /* @__PURE__ */ V([[
	"div",
	{
		class: "day-nav",
		role: "group",
		"aria-label": "Day"
	},
	[
		"button",
		{
			type: "button",
			"aria-label": "Previous day"
		},
		"‹"
	],
	" ",
	[
		"output",
		{ "aria-live": "polite" },
		" "
	],
	" ",
	[
		"button",
		{
			type: "button",
			"aria-label": "Next day"
		},
		"›"
	]
]]), bu = /* @__PURE__ */ V([
	[
		"button",
		{ type: "button" },
		" "
	],
	" ",
	,
], 1), xu = /* @__PURE__ */ V([
	[
		"span",
		{ class: "label" },
		"Range"
	],
	" ",
	["div", { class: "segmented" }]
], 1);
function Su(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => uu(Q.summary?.retention_days)), r = /* @__PURE__ */ O(() => fu(Q.summary, vu.day, Ea(/* @__PURE__ */ new Date())));
	var i = xu(), a = F(N(i), 2);
	K(a, 21, () => z(n), (e) => e.days, (e, t) => {
		var n = bu(), i = N(n), a = P(i, !0), o = F(i, 2), s = (e) => {
			var t = yu(), n = M(t), i = F(n, 2), a = P(i, !0), o = F(i, 2);
			T(t), I((e) => {
				n.disabled = !z(r)?.previous_day, W(a, e), o.disabled = !z(r)?.next_day;
			}, [() => pu(vu.day)]), B("click", n, () => vu.step("previous_day", Q.summary)), B("click", o, () => vu.step("next_day", Q.summary)), U(e, t);
		};
		G(o, (e) => {
			z(t).days === 1 && vu.days === 1 && e(s);
		}), I(() => {
			q(i, "aria-pressed", vu.days === z(t).days), W(a, z(t).label);
		}), B("click", i, () => vu.select(z(t).days)), U(e, n);
	}), T(a), U(e, i), D();
}
Tr(["click"]);
var Cu = 148, wu = "var(--status-critical)";
function Tu(e, t = /* @__PURE__ */ new Date()) {
	let n = Ga(e, t), r = no(n.unit === "hour" ? e.api_errors.hour : e.api_errors.day, n.keyOf), i = n.keys.map((e) => r(e).limits), a = n.keys.map((e) => r(e).other), o = i.reduce((e, t) => e + t, 0), s = Ua(i);
	return {
		buckets: n,
		limits: i,
		others: a,
		total: o,
		top: La(Math.max(...i, 0)),
		peak: i[s] ? s : null,
		empty: !i.some(Boolean) && !a.some(Boolean)
	};
}
function Eu(e, t, n, r, i) {
	let { band: a, barWidth: o } = mo(e, t), s = 120 * r / i;
	return {
		x: 56 + a * n + (a - o) / 2,
		y: 120 - s,
		width: o,
		height: s
	};
}
function Du(e) {
	return `rate-limit hits per ${e}; other API errors are in the tooltip, the table view and the list`;
}
function Ou(e, t) {
	return `Rate-limit hits per ${e}: ${Y(t)} in the range; table view available`;
}
function ku(e) {
	return `Rate-limit hits per ${e}; arrow keys step through them`;
}
function Au(e, t) {
	return `${e.buckets.long(e.buckets.keys[t] ?? "")}: ${Y(e.limits[t])} rate-limit hits, ${Y(e.others[t])} other API errors`;
}
function ju(e, t) {
	return {
		when: e.buckets.long(e.buckets.keys[t] ?? ""),
		limits: Y(e.limits[t]),
		others: Y(e.others[t])
	};
}
function Mu(e) {
	let { buckets: t } = e;
	return {
		head: [
			{ label: t.heading },
			{
				label: "Rate-limit hits",
				numeric: !0
			},
			{
				label: "Other API errors",
				numeric: !0
			}
		],
		rows: t.keys.map((n, r) => ({
			key: n,
			cells: [
				t.short(n),
				Y(e.limits[r]),
				Y(e.others[r])
			]
		})).reverse()
	};
}
var Nu = [
	{ label: "Window" },
	{
		label: "Hit after",
		numeric: !0
	},
	{
		label: "Hits",
		numeric: !0
	},
	{
		label: "Turns",
		numeric: !0
	},
	{
		label: "Input",
		numeric: !0
	},
	{
		label: "Cache read %",
		numeric: !0
	},
	{
		label: "Output",
		numeric: !0
	},
	{
		label: "Cost",
		numeric: !0
	}
];
function Pu(e, t) {
	return e.flatMap((e) => {
		let n = `${e.limit_type} ${e.resets_at}`;
		return [{
			key: n,
			kind: "window",
			name: io(e, t),
			cells: [
				wa(ro(e)),
				Y(e.hits),
				...ns(e.used)
			],
			sub: !1,
			group: e.models.length > 0
		}, ...e.models.slice().sort(es).map((e) => ({
			key: `${n} ${e.model}`,
			kind: "model",
			name: e.model,
			cells: [
				"",
				"",
				...ns(e)
			],
			sub: !0,
			group: !1
		}))];
	});
}
function Fu(e) {
	return e.map((e) => ({
		key: e.record_id,
		when: Z(e.ts),
		error: to(e),
		quota: eo(e.limit_type),
		resets: Z(e.resets_at),
		session: {
			href: Sc(e),
			name: xc(e),
			project: e.project
		},
		agent: e.agent_type
	}));
}
function Iu(e) {
	return [
		{ label: "When" },
		{ label: "Error" },
		{ label: "Quota" },
		{ label: "Resets" },
		...e ? [{ label: "Session" }] : [],
		{ label: "Agent" }
	];
}
//#endregion
//#region src/components/EventsTable.svelte
var Lu = /* @__PURE__ */ V([[
	"h3",
	null,
	" "
]]), Ru = /* @__PURE__ */ V([[
	"td",
	null,
	[
		"a",
		null,
		" "
	],
	[
		"span",
		{ class: "sub" },
		" "
	]
]]), zu = /* @__PURE__ */ V([
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	,
	" ",
	[
		"td",
		null,
		" "
	]
], 1);
function Bu(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = Lu(), r = P(n, !0);
		I(() => {
			q(n, "id", `${t.id ?? ""}-title`), W(r, t.title);
		}), U(e, n);
	}, r = (e, t = v) => {
		var n = zu(), r = N(n), a = P(r, !0), o = F(r, 2), s = P(o, !0), c = F(o, 2), l = P(c, !0), u = F(c, 2), d = P(u, !0), f = F(u, 2), p = (e) => {
			var n = Ru(), r = M(n), i = P(r, !0), a = P(F(r), !0);
			T(n), I(() => {
				q(r, "href", t().session.href), W(i, t().session.name), W(a, t().session.project);
			}), U(e, n);
		};
		G(f, (e) => {
			i() && e(p);
		});
		var m = P(F(f, 2), !0);
		I(() => {
			W(a, t().when), W(s, t().error), W(l, t().quota), W(d, t().resets), W(m, t().agent);
		}), U(e, n);
	}, i = Bi(t, "withSession", 3, !0);
	{
		let a = /* @__PURE__ */ O(() => Iu(i()));
		qs(e, {
			get key() {
				return t.pagerKey;
			},
			get columns() {
				return z(a);
			},
			get rows() {
				return t.rows;
			},
			rowKey: (e) => e.key,
			get cells() {
				return r;
			},
			get heading() {
				return n;
			},
			get empty() {
				return t.empty;
			},
			get labelledby() {
				return `${t.id ?? ""}-title`;
			}
		});
	}
	D();
}
//#endregion
//#region src/components/RateLimits.svelte
var Vu = (e) => {
	var t = nd(), n = P(t, !0);
	I((e) => W(n, e), [() => $("5-hour windows that hit the limit")]), U(e, t);
}, Hu = (e) => {
	U(e, rd());
}, Uu = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), Wu = /* @__PURE__ */ V([[
	"div",
	{ class: "legend" },
	,
]]), Gu = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	"No rate limits or API errors in this range."
]]), Ku = /* @__PURE__ */ V([["path"]], 4), qu = /* @__PURE__ */ V([[
	"text",
	{
		class: "value-text",
		"text-anchor": "middle"
	},
	" "
]], 4), Ju = /* @__PURE__ */ V([
	,
	,
	,
], 5), Yu = /* @__PURE__ */ V([
	,
	,
	,
	,
], 5), Xu = /* @__PURE__ */ V([["rect", {
	class: "column-mark",
	y: "0"
}]], 4), Zu = /* @__PURE__ */ V([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	[
		"div",
		{ class: "row" },
		,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			{ class: "name" },
			" "
		]
	],
	" ",
	[
		"div",
		{ class: "row" },
		,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			{ class: "name" },
			"other API errors"
		]
	]
], 1), Qu = /* @__PURE__ */ V([[
	"div",
	{ class: "chart" },
	,
]]), $u = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), ed = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	,
], 1), td = /* @__PURE__ */ V([
	,
	,
	" ",
	,
], 1), nd = /* @__PURE__ */ V([[
	"h3",
	null,
	" "
]]), rd = /* @__PURE__ */ V([[
	"p",
	{ class: "note" },
	"what each window used from its start (its reset less 5 hours) up to its first hit, as the transcripts here show it;\n    the limit also counts what you use elsewhere"
]]), id = /* @__PURE__ */ V([[
	"span",
	{ class: "window-model" },
	" "
]]), ad = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), od = /* @__PURE__ */ V([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1);
function sd(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Wu(), n = M(t), r = (e) => {
			var t = Uu(), n = M(t);
			Ds(n, { get fill() {
				return wu;
			} });
			var r = F(n);
			T(t), I(() => W(r, "⚠ Rate-limit hit")), U(e, t);
		};
		G(n, (e) => {
			z(c) && e(r);
		}), T(t), U(e, t);
	}, r = (e) => {
		var t = Qu(), n = M(t), r = (e) => {
			var t = H(), n = N(t), r = (e) => {
				U(e, Gu());
			}, i = (e) => {
				let t = (e, t = v) => {
					let n = /* @__PURE__ */ O(() => mo(t(), z(a).length));
					var r = Yu(), o = N(r);
					{
						let e = /* @__PURE__ */ O(() => Ia(z(c).top, 2));
						Zs(o, {
							get left() {
								return 56;
							},
							get right() {
								return z(n).right;
							},
							get values() {
								return z(e);
							},
							yOf: (e) => 120 - 120 * e / z(c).top,
							get format() {
								return Y;
							}
						});
					}
					var s = F(o);
					{
						let e = /* @__PURE__ */ O(() => 138);
						Ys(s, {
							get count() {
								return z(a).length;
							},
							xOf: (e) => 56 + z(n).band * (e + .5),
							get y() {
								return z(e);
							},
							text: (e) => z(i).short(z(a)[e] ?? "")
						});
					}
					K(F(s), 18, () => z(a), (e) => e, (e, n, r) => {
						let i = /* @__PURE__ */ O(() => z(c).limits[z(r)] ?? 0), o = /* @__PURE__ */ O(() => Eu(t(), z(a).length, z(r), z(i), z(c).top));
						var s = Ju(), l = N(s), u = (e) => {
							var t = Ku();
							I((e) => {
								q(t, "d", e), q(t, "fill", wu);
							}, [() => Ha(z(o).x, z(o).y, z(o).width, z(o).height, !0)]), U(e, t);
						};
						G(l, (e) => {
							z(o).height > 0 && e(u);
						});
						var d = F(l), f = (e) => {
							var t = qu(), n = P(t, !0);
							I((e) => {
								q(t, "x", z(o).x + z(o).width / 2), q(t, "y", z(o).y - 6), W(n, e);
							}, [() => Y(z(i))]), U(e, t);
						};
						G(d, (e) => {
							z(r) === z(c).peak && e(f);
						}), U(e, s);
					}), U(e, r);
				}, n = (e, t = v, n = v) => {
					let r = /* @__PURE__ */ O(() => mo(t(), z(a).length).band);
					var i = Xu();
					I(() => {
						q(i, "x", 56 + z(r) * n()), q(i, "width", z(r)), q(i, "height", 120);
					}), U(e, i);
				}, r = (e, t = v) => {
					let n = /* @__PURE__ */ O(() => ju(z(c), t()));
					var r = Zu(), i = N(r), a = P(i, !0), o = F(i, 2), s = M(o);
					Ds(s, { get fill() {
						return wu;
					} });
					var l = F(s), u = P(l, !0), d = P(F(l));
					T(o);
					var f = F(o, 2), p = M(f);
					Ds(p, { fill: null });
					var m = P(F(p), !0);
					je(), T(f), I(() => {
						W(a, z(n).when), W(u, z(n).limits), W(d, "⚠ rate-limit hits"), W(m, z(n).others);
					}), U(e, r);
				}, i = /* @__PURE__ */ O(() => z(c).buckets), a = /* @__PURE__ */ O(() => z(i).keys);
				{
					let i = /* @__PURE__ */ O(() => Ou(z(l), z(c).total));
					Ss(e, {
						get height() {
							return Cu;
						},
						get label() {
							return z(i);
						},
						get width() {
							return z(g);
						},
						get containerWidth() {
							return z(h);
						},
						get cursor() {
							return z(_);
						},
						get plot() {
							return t;
						},
						get marks() {
							return n;
						},
						get tip() {
							return r;
						}
					});
				}
			};
			G(n, (e) => {
				z(c).empty ? e(r) : e(i, -1);
			}), U(e, t);
		};
		G(n, (e) => {
			z(c) && e(r);
		}), T(t), Fi(t, "clientWidth", (e) => j(h, e)), U(e, t);
	}, i = (e) => {
		var t = H(), n = N(t), r = (e) => {
			let t = (e, t = v) => {
				var r = ed(), i = N(r), a = P(i, !0);
				K(F(i, 2), 19, () => z(n), (e) => e.label, (e, n, r) => {
					var i = $u(), a = P(i, !0);
					I(() => W(a, t().cells[z(r) + 1])), U(e, i);
				}), I(() => W(a, t().cells[0])), U(e, r);
			}, n = /* @__PURE__ */ O(() => z(d).head.slice(1));
			qs(e, {
				key: "limits-table",
				get columns() {
					return z(d).head;
				},
				get rows() {
					return z(d).rows;
				},
				rowKey: (e) => e.key,
				get cells() {
					return t;
				}
			});
		};
		G(n, (e) => {
			z(d) && e(r);
		}), U(e, t);
	}, a = (e) => {
		var t = H(), n = N(t), r = (e) => {
			var t = td(), n = N(t);
			qs(n, {
				key: "limit-windows",
				get columns() {
					return Nu;
				},
				get rows() {
					return z(f);
				},
				rowKey: (e) => e.key,
				get cells() {
					return o;
				},
				sub: (e) => e.sub,
				group: (e) => e.group,
				get heading() {
					return Vu;
				},
				get intro() {
					return Hu;
				},
				empty: "No 5-hour window hit its limit in this range."
			});
			var r = F(n, 2);
			{
				let e = /* @__PURE__ */ O(() => $("Latest API errors"));
				Bu(r, {
					id: "limit-events",
					get title() {
						return z(e);
					},
					get rows() {
						return z(p);
					},
					empty: "No API errors in this range.",
					pagerKey: "limit-events"
				});
			}
			U(e, t);
		};
		G(n, (e) => {
			z(s) && e(r);
		}), U(e, t);
	}, o = (e, t = v) => {
		var n = od(), r = N(n), i = M(r), a = (e) => {
			var n = id(), r = P(n, !0);
			I(() => W(r, t().name)), U(e, n);
		}, o = (e) => {
			var n = Mr();
			I(() => W(n, t().name)), U(e, n);
		};
		G(i, (e) => {
			t().kind === "model" ? e(a) : e(o, -1);
		}), T(r), K(F(r, 2), 19, () => m, (e) => e.label, (e, n, r) => {
			var i = ad(), a = P(i, !0);
			I(() => W(a, t().cells[z(r)])), U(e, i);
		}), U(e, n);
	}, s = /* @__PURE__ */ O(() => Q.summary), c = /* @__PURE__ */ O(() => z(s) ? Tu(z(s)) : null), l = /* @__PURE__ */ O(() => z(c)?.buckets.unit ?? "day"), u = /* @__PURE__ */ O(() => $("Rate limits")), d = /* @__PURE__ */ O(() => z(c) ? Mu(z(c)) : null), f = /* @__PURE__ */ O(() => z(s) ? Pu(z(s).api_errors.windows) : []), p = /* @__PURE__ */ O(() => z(s) ? Fu(z(s).api_errors.events) : []), m = Nu.slice(1), h = /* @__PURE__ */ A(0), g = /* @__PURE__ */ O(() => Wi(z(h))), _ = /* @__PURE__ */ O(() => z(c) ? {
		count: z(c).buckets.keys.length,
		label: ku(z(l)),
		valueText: (e) => Au(z(c), e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: mo(e, z(c).buckets.keys.length).right - 56,
			height: 120
		}),
		indexAt: (e) => ho(e, z(c).buckets.keys.length),
		tipX: (e, t) => 56 + mo(e, z(c).buckets.keys.length).band * (t + .5)
	} : null);
	{
		let t = /* @__PURE__ */ O(() => z(c) ? Du(z(l)) : void 0);
		Ts(e, {
			id: "limits",
			get title() {
				return z(u);
			},
			get note() {
				return z(t);
			},
			get legend() {
				return n;
			},
			get chart() {
				return r;
			},
			get table() {
				return i;
			},
			get extra() {
				return a;
			}
		});
	}
	D();
}
//#endregion
//#region src/components/SessionsList.svelte
var cd = (e) => {
	var t = ud(), n = P(M(t), !0);
	je(2), T(t), I((e) => W(n, e), [() => $("Sessions")]), U(e, t);
}, ld = (e, t = v) => {
	let n = /* @__PURE__ */ O(() => Ro(t()));
	var r = md(), i = N(r), a = P(i, !0), o = F(i, 2), s = M(o), c = P(s, !0), l = P(F(s), !0);
	T(o), K(F(o, 2), 17, () => z(n).slice(1), Jr, (e, t) => {
		var n = pd(), r = P(n, !0);
		I(() => W(r, z(t))), U(e, n);
	}), I((e, r) => {
		W(a, z(n)[0]), q(s, "href", e), W(c, r), W(l, t().project);
	}, [() => Sc(t()), () => xc(t())]), U(e, r);
}, ud = /* @__PURE__ */ V([[
	"h2",
	{ id: "sessions-title" },
	[
		"span",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		"what each used in the range"
	]
]]), dd = /* @__PURE__ */ V([[
	"option",
	null,
	" "
]]), fd = /* @__PURE__ */ V([[
	"div",
	{
		class: "table-filters",
		role: "search",
		"aria-label": "Filter the sessions"
	},
	[
		"select",
		{
			id: "sessions-project",
			"aria-label": "Project"
		},
		[
			"option",
			null,
			"All projects"
		],
		,
	],
	" ",
	["input", {
		type: "search",
		id: "sessions-search",
		"aria-label": "Filter by title, project or session id",
		placeholder: "Title, project or id",
		autocomplete: "off",
		spellcheck: "false"
	}],
	" ",
	[
		"span",
		{
			class: "muted",
			id: "sessions-count",
			"aria-live": "polite"
		},
		" "
	]
]]), pd = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), md = /* @__PURE__ */ V([
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"a",
			null,
			" "
		],
		[
			"span",
			{ class: "sub" },
			" "
		]
	],
	" ",
	,
], 1), hd = /* @__PURE__ */ V([
	,
	,
	" ",
	,
], 1), gd = /* @__PURE__ */ V([[
	"section",
	{
		class: "card",
		"aria-labelledby": "sessions-title"
	},
	,
]]);
function _d(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = fd(), n = M(t), o = M(n);
		o.value = o.__value = "", K(F(o), 17, () => z(c), (e) => e.project, (e, t) => {
			var n = dd(), r = P(n), i = {};
			I((e) => {
				W(r, `${z(t).project ?? ""} (${e ?? ""})`), i !== (i = z(t).project) && (n.value = (n.__value = i) ?? "");
			}, [() => Y(z(t).count)]), U(e, n);
		}), T(n), vi(n);
		var s = F(n, 2);
		Ei(s);
		var u = P(F(s, 2), !0);
		T(t), I(() => W(u, z(l))), yi(n, () => z(i), (e) => {
			j(i, e, !0), Is.forget(r);
		}), ji(s, () => z(a), (e) => {
			j(a, e, !0), Is.forget(r);
		}), U(e, t);
	}, r = "sessions", i = /* @__PURE__ */ A(""), a = /* @__PURE__ */ A(""), o = /* @__PURE__ */ O(() => Q.summary?.sessions ?? null), s = /* @__PURE__ */ O(() => z(o) ? z(o).filter((e) => Fo(e, z(i), z(a))) : []), c = /* @__PURE__ */ O(() => Io(z(o) ?? [], z(i))), l = /* @__PURE__ */ O(() => z(o) ? zo(z(s).length, z(o).length) : "");
	var u = gd(), d = M(u), f = (e) => {
		{
			let t = /* @__PURE__ */ O(() => z(o).length ? "No sessions match the filter." : "No sessions in this range.");
			qs(e, {
				key: r,
				get columns() {
					return Lo;
				},
				get rows() {
					return z(s);
				},
				rowKey: (e) => e.session_id,
				get cells() {
					return ld;
				},
				get heading() {
					return cd;
				},
				get intro() {
					return n;
				},
				get empty() {
					return z(t);
				},
				labelledby: "sessions-title"
			});
		}
	}, p = (e) => {
		var t = hd(), r = N(t);
		cd(r);
		var i = F(r, 2);
		n(i), U(e, t);
	};
	G(d, (e) => {
		z(o) ? e(f) : e(p, -1);
	}), T(u), U(e, u), D();
}
//#endregion
//#region src/lib/opening.ts
function vd() {
	let e = document.activeElement, t = e && e !== document.body ? e : null;
	return {
		href: t?.getAttribute("href") ?? null,
		element: t,
		scroll: window.scrollY
	};
}
function yd(e) {
	return e.element?.isConnected ? e.element : e.href === null ? null : [...document.querySelectorAll("a[href]")].find((t) => t.getAttribute("href") === e.href) ?? null;
}
function bd(e) {
	return (t) => {
		let n = vd(), r = [];
		for (let t of e.hide) {
			let e = document.getElementById(t);
			e && (e.hidden = !0, r.push(e));
		}
		return t.scrollIntoView({ block: "start" }), t.querySelector(e.focus)?.focus({ preventScroll: !0 }), () => {
			for (let e of r) e.hidden = !1;
			window.scrollTo(0, n.scroll), yd(n)?.focus({ preventScroll: !0 });
		};
	};
}
//#endregion
//#region src/lib/session.ts
function xd(e) {
	let t = e.git_branch ? ` · ${e.git_branch}` : "";
	return `${e.project}${t} · ${Z(e.first_ts)} – ${Z(e.last_ts)} · ${e.session_id}`;
}
function Sd(e) {
	return e.some((e) => e.web_searches);
}
function Cd(e) {
	return [
		{ label: "Agent" },
		{ label: "Model" },
		{
			label: "Turns",
			numeric: !0
		},
		{
			label: "Context first → last",
			numeric: !0
		},
		{
			label: "Input total",
			numeric: !0
		},
		{
			label: "Cache read %",
			numeric: !0
		},
		{
			label: "Output",
			numeric: !0
		},
		...e ? [{
			label: "Web searches",
			numeric: !0
		}] : [],
		{
			label: "Returned",
			numeric: !0,
			title: "what a subagent handed back: its result's characters"
		},
		{
			label: "Cost",
			numeric: !0
		}
	];
}
function wd(e) {
	return e.models.length ? e.models.map((t) => {
		let n = e.model_efforts.filter((e) => e.model === t).map((e) => e.effort);
		return n.length ? `${t} · ${n.join(", ")}` : t;
	}) : ["–"];
}
function Td(e, t) {
	return [
		Y(e.turns),
		`${J(e.context_first)} → ${J(e.context_last)}`,
		J(e.input_total),
		Ca(e.cache_read, e.input_total),
		J(e.output),
		...t ? [Y(e.web_searches)] : [],
		J(e.returned_chars),
		X(e.cost)
	];
}
function Ed(e, t, n) {
	let r = e.workflow_phase ? ` · ${e.workflow_phase}` : "";
	return {
		key: e.agent_id ?? "main",
		kind: n,
		name: e.agent_type,
		detail: `${e.description || ""}${r}`,
		models: wd(e),
		fold: null,
		cells: Td(e, t)
	};
}
function Dd(e, t, n) {
	let r = (e) => t.reduce((t, n) => t + (n[e] || 0), 0), i = t.map((e) => e.cost).filter((e) => e !== null), a = t[0];
	return {
		key: `run:${e}`,
		kind: "run",
		name: `workflow · ${a.workflow_name || e}`,
		detail: "",
		models: [...new Set(t.flatMap((e) => e.models))],
		fold: {
			run: e,
			label: `${Y(t.length)} agents`
		},
		cells: [
			Y(r("turns")),
			"–",
			J(r("input_total")),
			Ca(r("cache_read"), r("input_total")),
			J(r("output")),
			...n ? [Y(r("web_searches"))] : [],
			"–",
			i.length ? X(i.reduce((e, t) => e + t, 0)) : "–"
		]
	};
}
function Od(e, t) {
	let n = Sd(e), r = /* @__PURE__ */ new Map(), i = [];
	for (let t of e) t.workflow_run === null ? i.push(t) : r.has(t.workflow_run) ? r.get(t.workflow_run).push(t) : (r.set(t.workflow_run, [t]), i.push(t.workflow_run));
	return i.flatMap((e) => {
		if (typeof e != "string") return [Ed(e, n, "agent")];
		let i = r.get(e);
		return [Dd(e, i, n), ...t.includes(e) ? i.map((e) => Ed(e, n, "member")) : []];
	});
}
function kd() {
	return [
		{ label: "Agent" },
		{ label: "Tool" },
		{
			label: "Calls",
			numeric: !0
		},
		{
			label: "Errors",
			numeric: !0,
			title: "calls whose result was an error"
		},
		{
			label: "Result characters",
			numeric: !0
		},
		{
			label: "Median",
			numeric: !0,
			title: "a result's characters, the median call"
		},
		{
			label: "p90",
			numeric: !0,
			title: "…and at the 90th percentile"
		},
		{
			label: "Input median",
			numeric: !0,
			title: "the characters of a call's input, which the model wrote"
		},
		{
			label: "Calls after",
			numeric: !0,
			title: "how many later calls carried it in their context, the median call, up to the next compaction"
		},
		{
			label: "~Carried",
			numeric: !0,
			title: "what the later calls paid to have its input and result in their context"
		},
		{
			label: "~Input cost",
			numeric: !0,
			title: "its input at the output price"
		}
	];
}
function Ad(e) {
	return e.some((e) => e.tool_kinds?.length) ? "Bash splits by what a command does, MCP by server. A call’s input and result stay in the context, so every later call up to the next compaction reads them again: ~Carried estimates what that cost, taking a token as 2.3 characters (measured on real transcripts, a heuristic)." : null;
}
function jd(e, t) {
	let n = Vo([...e]), { above: r, folds: i } = Yo(n), a = new Set(t), o = new Map(i.map((e) => [e.row, e]));
	return n.flatMap((e, t) => {
		if (!Xo(r[t] ?? [], a)) return [];
		let i = o.get(t);
		return [{
			key: e.key,
			agent: e.sub ? "" : e.agent,
			name: Jo(e),
			fold: i ? {
				fold: i.fold,
				label: i.label,
				open: a.has(i.fold)
			} : null,
			sub: e.sub,
			group: qo(e, n[t + 1]) === "group-row",
			cells: [
				Y(e.calls),
				Y(e.errors),
				J(e.result_chars),
				J(e.result_median),
				J(e.result_p90),
				J(e.input_median),
				Y(e.calls_after_median),
				X(e.carried),
				X(e.input_cost)
			]
		}];
	});
}
//#endregion
//#region src/lib/tiles.ts
function Md(e, t = Ea(/* @__PURE__ */ new Date()), n) {
	let r = e.history_since, i = r && r > e.since ? ` (history since ${Da(r, n)})` : "";
	return e.days === 1 ? e.until === t ? "today" : Oa(e.until, n) : `last ${e.days} days${i}`;
}
function Nd(e) {
	let t = [e.unpriced_turns ? `${Y(e.unpriced_turns)} turns of models without a price are not included` : "at API list prices"];
	return e.web_searches && t.push(`incl. ${Y(e.web_searches)} web searches, ${X(e.cost_parts.web_search)}`), t.join(" · ");
}
var Pd = "Each main-thread compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out. ~: the summary call is estimated.";
function Fd(e) {
	let t = e.compactions === 1 ? "1 compaction" : `${Y(e.compactions)} compactions`, n = e.unknown ? `${Y(e.unknown)} without an estimate` : null;
	if (!e.compactions) return {
		title: Pd,
		verdict: null,
		amount: null,
		count: `Compacting: ${n}`
	};
	let r = e.net >= 0;
	return {
		title: Pd,
		verdict: r ? "gain" : "loss",
		amount: r ? `▲ compacting saved ~${X(e.net)} so far` : `▼ compacting cost ~${X(-e.net)} more so far`,
		count: `(${[t, n].filter(Boolean).join(", ")})`
	};
}
function Id(e) {
	let t = e.cost_parts;
	return [{
		label: "Processed",
		tokens: e.new_input + e.cache_write,
		cost: t.new_input + t.cache_write,
		color: "var(--split-strong)",
		note: `New input ${J(e.new_input)} + cache writes ${J(e.cache_write)}, billed at full price or more`
	}, {
		label: "From cache",
		tokens: e.cache_read,
		cost: t.cache_read,
		color: "var(--split-soft)",
		note: "Cache reads, billed at a tenth of the input price and not processed again"
	}];
}
function Ld(e, t) {
	let n = Pa(t);
	return e.map((e) => `${e.label} ${Ca(e.tokens, n)}`).join(", ");
}
function Rd(e, t) {
	return e?.turns ? `median context ${J(e.median)} per turn (p90 ${J(e.p90)})` + (t ? ` · compact hint at ${J(t)}` : "") : null;
}
function zd(e, t, n, r) {
	let i = e.api_ms_without_retries === null ? null : e.api_ms - e.api_ms_without_retries, a = "no time lost to retries";
	return i === null ? a = "retries are not in the transcripts" : i > 0 && (a = `${wa(i)} of it retries`), {
		session: `wall-clock, ${t}`,
		api: a,
		tools: r ? "from each call to its result, incl. waiting for permission" : `${Ca(e.tool_ms, e.duration_ms)} of the session time`,
		lines: n === null ? "no lines changed" : `${X(n)} per 100 lines changed`
	};
}
function Bd(e) {
	return `${Y(e)} ${e === 1 ? "session" : "sessions"} that ended in the range`;
}
function Vd(e) {
	return e === "cost_record" ? "from its cost record" : "estimated from the transcripts";
}
function Hd(e) {
	let t = e.runtime.lines_added + e.runtime.lines_removed;
	return e.cost === null || t === 0 ? null : e.cost / t * 100;
}
//#endregion
//#region src/lib/usage.ts
function Ud(e) {
	return [{ label: e }, ...ts];
}
function Wd(e, t) {
	return e.slice().sort(es).map((e) => ({
		key: t(e),
		name: t(e),
		kind: "plain",
		swatch: null,
		cells: ns(e),
		sub: !1,
		group: !1
	}));
}
function Gd(e, t, n) {
	return e.slice().sort(es).flatMap((e) => [{
		key: e.model,
		name: e.model,
		kind: "model",
		swatch: la(n.get(e.model) ?? null),
		cells: ns(e),
		sub: !1,
		group: !0
	}, ...t.filter((t) => t.model === e.model && t.effort !== null).sort((e, t) => ta(e.effort ?? "") - ta(t.effort ?? "") || (e.effort ?? "").localeCompare(t.effort ?? "")).map((t) => ({
		key: `${e.model}\u0000${t.effort}`,
		name: ra(t.effort),
		kind: "effort",
		swatch: null,
		cells: ns(t),
		sub: !0,
		group: !1
	}))]);
}
//#endregion
//#region src/components/AgentsTable.svelte
var Kd = (e) => {
	U(e, qd());
}, qd = /* @__PURE__ */ V([[
	"h3",
	{ id: "session-agents-title" },
	"Main thread and subagents"
]]), Jd = /* @__PURE__ */ V([[
	"span",
	{ class: "sub" },
	[
		"button",
		{
			type: "button",
			class: "link-button"
		},
		" "
	]
]]), Yd = /* @__PURE__ */ V([[
	"span",
	{ class: "sub" },
	" "
]]), Xd = /* @__PURE__ */ V([[
	"div",
	null,
	" "
]]), Zd = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Qd = /* @__PURE__ */ V([
	[
		"td",
		null,
		[
			"strong",
			null,
			" "
		],
		" ",
		,
	],
	" ",
	["td"],
	" ",
	,
], 1);
function $d(e, t) {
	E(t, !0);
	let n = (e, t = v) => {
		var n = Qd(), i = N(n), a = M(i), s = P(a, !0), c = F(a, 2), l = (e) => {
			let n = /* @__PURE__ */ O(() => t().fold), i = /* @__PURE__ */ O(() => z(r).includes(z(n).run));
			var a = Jd(), s = M(a), c = P(s, !0);
			T(a), I(() => {
				q(s, "aria-expanded", z(i)), W(c, z(n).label);
			}), B("click", s, () => o(z(n).run)), U(e, a);
		}, u = (e) => {
			var n = Yd(), r = P(n, !0);
			I(() => W(r, t().detail)), U(e, n);
		};
		G(c, (e) => {
			t().fold ? e(l) : e(u, -1);
		}), T(i);
		var d = F(i, 2);
		K(d, 20, () => t().models, (e) => e, (e, t) => {
			var n = Xd(), r = P(n, !0);
			I(() => W(r, t)), U(e, n);
		}), T(d), K(F(d, 2), 17, () => t().cells, Jr, (e, t) => {
			var n = Zd(), r = P(n, !0);
			I(() => W(r, z(t))), U(e, n);
		}), I(() => W(s, t().name)), U(e, n);
	}, r = /* @__PURE__ */ A(Qt([])), i = /* @__PURE__ */ O(() => Cd(Sd(t.agents))), a = /* @__PURE__ */ O(() => Od(t.agents, z(r)));
	function o(e) {
		j(r, z(r).includes(e) ? z(r).filter((t) => t !== e) : [...z(r), e], !0);
	}
	qs(e, {
		get key() {
			return t.pagerKey;
		},
		get columns() {
			return z(i);
		},
		get rows() {
			return z(a);
		},
		rowKey: (e) => e.key,
		get cells() {
			return n;
		},
		sub: (e) => e.kind === "member",
		group: (e) => e.kind === "run",
		rowClass: (e) => e.kind === "member" ? "workflow-member" : void 0,
		get heading() {
			return Kd;
		},
		labelledby: "session-agents-title"
	}), D();
}
Tr(["click"]);
//#endregion
//#region src/lib/clock.svelte.ts
var ef = 2 ** 31 - 1, tf = 1e3;
function nf(e) {
	let t = (/* @__PURE__ */ new Date()).toISOString(), n = Fr((n) => {
		t = (/* @__PURE__ */ new Date()).toISOString();
		let r = e === null ? NaN : Date.parse(e) - Date.now();
		if (!(r > 0 && r <= ef)) return;
		let i = setTimeout(() => {
			t = (/* @__PURE__ */ new Date()).toISOString(), n();
		}, r + tf);
		return () => clearTimeout(i);
	});
	return {
		get expired() {
			return n(), e !== null && Date.parse(e) < Date.now();
		},
		get now() {
			return n(), t;
		}
	};
}
//#endregion
//#region src/lib/gauge.ts
function rf(e) {
	return `Before it, the context was ${J(e.context)} of ${J(e.auto_compact)}. The next reply shows the new one: the summary, with the system prompt, tools and CLAUDE.md sent again.`;
}
function af(e) {
	return `${(e * 100).toFixed(1)}%`;
}
function of(e) {
	let t = `Latest context, main thread · ${e.model}`;
	if (e.compacted) return {
		kind: "compacted",
		label: t,
		value: "Compacted",
		secondary: `at ${Z(e.compacted)}, no reply since`,
		note: rf(e)
	};
	let n = e.hint_tokens < e.auto_compact ? e.hint_tokens / e.auto_compact : null, r = e.last_compaction ? `since the last compaction (${Z(e.last_compaction)})` : "since the session started", i = e.mean_step === null ? "too few turns for an estimate" : e.turns_left === null ? `${Sa(e.mean_step)} per turn, not growing` : `about ${Y(e.turns_left)} turns left at ${Sa(e.mean_step)} per turn (mean of the last 10)`;
	return {
		kind: "meter",
		label: t,
		value: J(e.context),
		secondary: `of ${J(e.auto_compact)} · ${Ca(e.context, e.auto_compact)}`,
		meterLabel: `Latest context ${J(e.context)} of the auto-compact point ${J(e.auto_compact)}`,
		max: e.auto_compact,
		now: e.context,
		fill: af(Math.min(1, e.context / e.auto_compact)),
		hintAt: n === null ? null : af(n),
		note: [
			`${J(e.headroom)} until auto-compact`,
			n === null ? null : `the mark is the compact hint at ${J(e.hint_tokens)}, a heuristic`,
			`${Y(e.turns_since_compaction)} turns ${r}`,
			i
		].filter(Boolean).join(" · ")
	};
}
function sf(e, t) {
	let n = e.cache_warm_until, r = n === null ? null : t ? `The cache has likely expired (${Z(n)}): the next reply sends it all at the full price, ${X(e.keep_across_break)} more.` : `The cache stays warm until ${Z(n)} (${e.cache_ttl_minutes} min after the last request); after that, the next reply costs ${X(e.keep_across_break)} more.`, i = [`Every reply sends the whole conversation again: ${J(e.before)}, ${X(e.reread_cost)} each time from the cache.`, r].filter(Boolean).join(" "), a = e.estimate;
	if (!a) {
		let t = e.stored_compactions;
		return {
			exact: i,
			missing: `No estimate of compacting now: ${t ? `your ${Y(t)} stored ${t === 1 ? "compaction carries" : "compactions carry"} no duration or output speed to estimate the summary from` : "no stored compaction to learn from yet"}.`,
			estimate: null
		};
	}
	return {
		exact: i,
		missing: null,
		estimate: cf(e, a, t)
	};
}
function cf(e, t, n) {
	let r = e.cache_warm_until, i = `${Y(t.compactions)} stored ${t.compactions === 1 ? "compaction" : "compactions"}`, a = Y(t.calls_after_low), o = Y(t.calls_after_high), s = t.calls_after_low === null ? "" : `, which were followed by ${a === o ? a : `${a}–${o}`} replies until the next one`, c = Vc(t, n), l = [Hc(c, t, n), `Learnt from your ${i}${s}.`];
	return t.before_break !== null && !n && r !== null && l.push(`Compacting before a break past ${Z(r)} saves about ${X(t.before_break)} at once.`), {
		lead: `If you compacted now, it would shrink to about ${J(t.after)}${Bc(J(t.after_low), J(t.after_high))}. ` + (n ? "Compacting " : `That costs ~${X(t.one_time)} once and `),
		tone: c,
		phrase: Uc(t, n),
		rest: `. ${l.filter(Boolean).join(" ")}`
	};
}
function lf(e, t) {
	let n = e.estimate, r = [t ? `The cache has expired, so the next reply sends your whole conversation (${J(e.before)}) again at the full price.` : `Every reply sends your whole conversation again: ${J(e.before)}, ~${X(e.reread_cost)} each time from the cache.`];
	return n && r.push(`Compacting would shrink it to about ${J(n.after)}` + (t ? ` and ${Uc(n, !0)}.` : `. That costs ~${X(n.one_time)} once and ${Uc(n, !1)}.`)), r;
}
function uf(e, t, n) {
	let r = e.compact_now;
	if (!r) return null;
	let i = r.estimate, a = r.cache_warm_until;
	if (t === "cold") return i ? {
		title: "⚠ The cache has expired: compacting now saves money",
		lines: [`The cache has expired, so the next reply sends your whole conversation (${J(r.before)}) again at the full price. Compacting would shrink it to about ${J(i.after)}. Doing it now saves about ${X(i.cold_saving)} at once.`]
	} : null;
	let o = lf(r, n);
	return !n && i && i.before_break !== null && i.before_break > 0 && a !== null && o.push(`Taking a break past ${Z(a)}? Compact before it: the cache expires then, and compacting first saves about ${X(i.before_break)} at the next reply.`), o.push("How many replies still follow can't be predicted, so past your own threshold ([chat] compact_hint_tokens) this shows whatever the estimate says."), {
		title: `⚠ Your context is past your ${J(e.hint_tokens)} compact hint`,
		lines: o
	};
}
function df(e) {
	let t = e.exploration, n = e.compact_now?.estimate;
	if (!t || !n || n.calls_ahead === null) return null;
	let r = Y(Math.round(n.calls_ahead));
	return {
		title: "Explore in a subagent",
		lines: [`Since the last compaction the main thread has read, searched and listed ${J(t.tokens)} tokens in ${Y(t.calls)} calls. They stay in the context: every reply reads them again, ~${X(t.reread)} each and ~${X(t.carried)} so far.`, (n.ahead_from === "longer" ? `After your past compactions, a stretch this long went on for about ${r} more replies on average. ` : `After your past compactions you went on for about ${r} replies on average. `) + "A subagent (such as Explore) reads in its own context and hands back only its summary, so the next search costs less delegated."],
		note: "A heuristic ([chat] delegate_hint_tokens and delegate_calls_ahead): replayed on real sessions, delegating was cheaper in 52 of 53 cases with 60 to 150 calls ahead, and about even with 20 to 60."
	};
}
//#endregion
//#region src/components/CompactCall.svelte
var ff = /* @__PURE__ */ V([[
	"p",
	null,
	" "
]]), pf = /* @__PURE__ */ V(["Copy it from here: ", ["input", {
	type: "text",
	readonly: "",
	"aria-label": "The command to copy",
	class: "compact-call-field"
}]], 1), mf = /* @__PURE__ */ V([[
	"div",
	{
		class: "card compact-call",
		id: "compact-call",
		role: "region",
		"aria-labelledby": "compact-call-title"
	},
	[
		"strong",
		{ id: "compact-call-title" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "compact-call-actions" },
		[
			"button",
			{
				type: "button",
				id: "compact-copy"
			},
			"Copy /compact"
		],
		" ",
		[
			"span",
			{
				class: "compact-call-status",
				role: "status"
			},
			,
		]
	]
]]);
function hf(e, t) {
	E(t, !0);
	let n = "/compact", r = /* @__PURE__ */ A("no");
	async function i() {
		try {
			await navigator.clipboard.writeText(n), j(r, "yes");
		} catch {
			j(r, "by hand");
		}
	}
	function a(e) {
		e.select();
	}
	var o = mf(), s = M(o), c = P(s, !0), l = F(s, 2);
	K(l, 16, () => t.call.lines, (e) => e, (e, t) => {
		var n = ff(), r = P(n, !0);
		I(() => W(r, t)), U(e, n);
	});
	var u = F(l, 2), d = M(u), f = F(d, 2), p = M(f), m = (e) => {
		U(e, Mr("Copied: paste it into Claude Code."));
	}, h = (e) => {
		var t = pf(), r = F(N(t));
		Ei(r), Di(r, n), ri(r, () => a), U(e, t);
	};
	G(p, (e) => {
		z(r) === "yes" ? e(m) : z(r) === "by hand" && e(h, 1);
	}), T(f), T(u), T(o), I(() => W(c, t.call.title)), B("click", d, i), U(e, o), D();
}
Tr(["click"]);
//#endregion
//#region src/components/DelegateCall.svelte
var gf = /* @__PURE__ */ V([[
	"p",
	null,
	" "
]]), _f = /* @__PURE__ */ V([[
	"div",
	{
		class: "card delegate-call",
		id: "delegate-call",
		role: "region",
		"aria-labelledby": "delegate-call-title"
	},
	[
		"strong",
		{ id: "delegate-call-title" },
		" "
	],
	" ",
	,
	" ",
	[
		"p",
		{ class: "muted" },
		" "
	]
]]);
function vf(e, t) {
	E(t, !0);
	var n = _f(), r = M(n), i = P(r, !0), a = F(r, 2);
	K(a, 16, () => t.call.lines, (e) => e, (e, t) => {
		var n = gf(), r = P(n, !0);
		I(() => W(r, t)), U(e, n);
	});
	var o = P(F(a, 2), !0);
	T(n), I(() => {
		W(i, t.call.title), W(o, t.call.note);
	}), U(e, n), D();
}
//#endregion
//#region src/components/ContextGauge.svelte
var yf = /* @__PURE__ */ V([["span", { class: "gauge-hint" }]]), bf = /* @__PURE__ */ V([[
	"div",
	{
		class: "gauge",
		role: "meter",
		"aria-valuemin": "0"
	},
	["span", { class: "gauge-fill" }],
	" ",
	,
]]), xf = /* @__PURE__ */ V([["span", { "aria-hidden": "true" }]]), Sf = /* @__PURE__ */ V([[
	"p",
	{ class: "compact-estimate" },
	" ",
	,
	[
		"strong",
		null,
		" "
	],
	" "
]]), Cf = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), wf = /* @__PURE__ */ V([
	[
		"div",
		{ class: "note" },
		" "
	],
	" ",
	,
], 1), Tf = /* @__PURE__ */ V([
	,
	,
	" ",
	,
	" ",
	[
		"div",
		{
			class: "card gauge-card",
			id: "current-gauge"
		},
		[
			"div",
			{ class: "label" },
			" "
		],
		" ",
		[
			"div",
			{ class: "tile-value" },
			" ",
			[
				"span",
				{ class: "secondary" },
				" "
			]
		],
		" ",
		,
		" ",
		[
			"div",
			{ class: "note" },
			" "
		],
		" ",
		,
	]
], 1);
function Ef(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => Q.session), r = /* @__PURE__ */ O(() => z(n)?.current ?? null), i = /* @__PURE__ */ O(() => z(r)?.compact_now?.cache_warm_until ?? null), a = /* @__PURE__ */ O(() => nf(z(i))), o = /* @__PURE__ */ O(() => z(n) ? Wc(z(n), z(a).now) : null), s = /* @__PURE__ */ O(() => z(r) && z(o) ? uf(z(r), z(o), z(a).expired) : null), c = /* @__PURE__ */ O(() => z(n) && z(r) && Gc(z(n)) ? df(z(r)) : null), l = /* @__PURE__ */ O(() => z(r) ? of(z(r)) : null), u = /* @__PURE__ */ O(() => z(l)?.kind === "meter" && z(r)?.compact_now ? sf(z(r).compact_now, z(a).expired) : null);
	var d = H(), f = N(d), p = (e) => {
		var t = Tf(), n = N(t), r = (e) => {
			hf(e, { get call() {
				return z(s);
			} });
		};
		G(n, (e) => {
			z(s) && e(r);
		});
		var i = F(n, 2), a = (e) => {
			vf(e, { get call() {
				return z(c);
			} });
		};
		G(i, (e) => {
			z(c) && e(a);
		});
		var o = F(i, 2), d = M(o), f = P(d, !0), p = F(d, 2), m = M(p), h = P(F(m), !0);
		T(p);
		var g = F(p, 2), _ = (e) => {
			var t = bf(), n = M(t);
			let r;
			var i = F(n, 2), a = (e) => {
				var t = yf();
				let n;
				I(() => n = mi(t, "", n, { left: z(l).hintAt })), U(e, t);
			};
			G(i, (e) => {
				z(l).hintAt !== null && e(a);
			}), T(t), I(() => {
				q(t, "aria-valuemax", z(l).max), q(t, "aria-valuenow", z(l).now), q(t, "aria-label", z(l).meterLabel), r = mi(n, "", r, { width: z(l).fill });
			}), U(e, t);
		};
		G(g, (e) => {
			z(l).kind === "meter" && e(_);
		});
		var v = F(g, 2), y = P(v, !0), ee = F(v, 2), b = (e) => {
			var t = wf(), n = N(t), r = P(n, !0), i = F(n, 2), a = (e) => {
				let t = /* @__PURE__ */ O(() => z(u).estimate);
				var n = Sf(), r = M(n, !0), i = F(r), a = (e) => {
					var n = xf();
					I(() => fi(n, 1, `payoff-mark payoff-${z(t).tone ?? ""}`)), U(e, n);
				};
				G(i, (e) => {
					z(t).tone && e(a);
				});
				var o = F(i), s = P(o, !0), c = F(o, 1, !0);
				T(n), I(() => {
					W(r, z(t).lead), W(s, z(t).phrase), W(c, z(t).rest);
				}), U(e, n);
			}, o = (e) => {
				var t = Cf(), n = P(t, !0);
				I(() => W(n, z(u).missing)), U(e, t);
			};
			G(i, (e) => {
				z(u).estimate ? e(a) : z(u).missing && e(o, 1);
			}), I(() => W(r, z(u).exact)), U(e, t);
		};
		G(ee, (e) => {
			z(u) && e(b);
		}), T(o), I(() => {
			W(f, z(l).label), W(m, `${z(l).value ?? ""} `), W(h, z(l).secondary), W(y, z(l).note);
		}), U(e, t);
	};
	G(f, (e) => {
		z(l) && e(p);
	}), U(e, d), D();
}
var Df = [
	{
		field: "cache_read",
		label: "Cache read",
		color: "var(--context-read)"
	},
	{
		field: "cache_write",
		label: "Cache write",
		color: "var(--context-write)"
	},
	{
		field: "new_input",
		label: "New input",
		color: "var(--context-new)"
	}
], Of = {
	manual: "/compact",
	auto: "auto-compact"
}, kf = "No turns with usage.", Af = "No turn grew the context.", jf = "No compactions.", Mf = `${Xc} Each compaction is compared over its own stretch, up to the next one; the Estimated cost tile adds up the main thread's.`;
function Nf(e) {
	return e.agent_id ?? "main";
}
function Pf(e) {
	return e.agent_id === null ? "main thread" : e.description ? `${e.agent_type} · ${e.description}` : e.agent_type;
}
function Ff(e) {
	return e.filter((e) => e.context_per_turn.length);
}
function If(e, t) {
	let n = Ff(e);
	return n.find((e) => Nf(e) === t) ?? n[0] ?? null;
}
function Lf(e) {
	let t = Ff(e);
	if (t.length < 2) return [];
	let n = [], r = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = {
			value: Nf(e),
			label: Pf(e)
		};
		if (e.workflow_run === null) {
			n.push({
				kind: "option",
				...t
			});
			continue;
		}
		let i = r.get(e.workflow_run);
		i || (i = {
			kind: "group",
			key: e.workflow_run,
			label: `workflow · ${e.workflow_name || e.workflow_run}`,
			options: []
		}, r.set(e.workflow_run, i), n.push(i)), i.options.push(t);
	}
	return n;
}
function Rf(e, t) {
	return `${e}-${t ? Nf(t) : "none"}`;
}
function zf(e) {
	return e ? `${Pf(e)}: every turn sends its whole context again` : "";
}
function Bf(e, t) {
	let n = t.map((e) => e.context), r = n[n.length - 1] ?? 0;
	return `Context per turn of the ${Pf(e)}, by cache read, cache write and new input: ${t.length} turns, peak ${J(Math.max(...n))}, last ${J(r)}; table view available`;
}
var Vf = 206;
function Hf(e) {
	return Fa(Math.max(0, ...e.map((e) => e.context)));
}
function Uf(e) {
	return (t) => 178 - 160 * t / e;
}
function Wf(e, t, n) {
	let r = e.map(() => 0);
	return Df.map((i) => {
		let a = r.map((t, n) => t + (e[n]?.[i.field] ?? 0)), o = (e, r) => `${t(r).toFixed(1)},${n(e).toFixed(1)}`, s = a.map(o), c = r.map(o).reverse(), l = r;
		if (r = a, e.length === 1) {
			let e = n(a[0] ?? 0);
			return {
				part: i,
				kind: "column",
				x: t(0) - 6,
				y: e,
				width: 12,
				height: Math.max(0, n(l[0] ?? 0) - e)
			};
		}
		return {
			part: i,
			kind: "area",
			area: `M${s.join("L")}L${c.join("L")}Z`,
			edge: `M${s.join("L")}`
		};
	});
}
function Gf(e, t, n) {
	return !e || e > t ? null : {
		y: Math.round(n(e)) + .5,
		text: `hint ${J(e)}`
	};
}
function Kf(e, t) {
	if (!t.ts) return -1;
	let n = Date.parse(t.ts);
	return e.findIndex((e) => e.ts && Date.parse(e.ts) > n);
}
function qf(e, t, n) {
	let r = [], i = -Infinity;
	return e.forEach((e, a) => {
		let o = Kf(t, e);
		if (o < 0) return;
		let s = o > 0 ? (n(o - 1) + n(o)) / 2 : n(0), c = s - i >= 44;
		c && (i = s), r.push({
			key: String(a),
			x: s,
			label: c ? Of[e.trigger ?? ""] ?? "compaction" : null
		});
	}), r;
}
function Jf(e, t, n, r) {
	let i = e.length - 1, a = Ua(e);
	return (a === i ? [i] : [a, i]).map((a) => {
		let o = a === i, s = e[a] ?? 0, c = r.some((e) => e >= t(a) && e - t(a) < 44);
		return {
			key: o ? "last" : "peak",
			x: o ? t(a) + 9 : c ? t(a) - 6 : t(a),
			y: o ? n(s) + 4 : n(s) - 8,
			anchor: o ? "start" : c ? "end" : "middle",
			text: o ? J(s) : `peak ${J(s)}`
		};
	});
}
function Yf(e, t) {
	let n = e[t], r = n?.effort ? ` · effort ${n.effort}` : "";
	return `Turn ${Y(t + 1)} of ${Y(e.length)} · ${Z(n?.ts ?? null)}${r}`;
}
function Xf(e) {
	let t = [];
	if (e.growth !== null && t.push(`grew ${Sa(e.growth)} beyond the last reply`), e.rebuild) {
		let n = e.rebuild.extra_cost === null ? "" : `, +${X(e.rebuild.extra_cost)}`;
		t.push(`cache rebuilt: ${Jc[e.rebuild.cause]} (${J(e.rebuild.lost)}${n})`);
	}
	return t;
}
function Zf(e) {
	return [
		`context ${J(e.context)}`,
		...Df.map((t) => `${t.label.toLowerCase()} ${J(e[t.field])}`),
		...Xf(e)
	];
}
function Qf(e, t) {
	let n = e[t];
	return n ? `${Yf(e, t)}: ${Zf(n).join(", ")}` : "";
}
var $f = [
	{
		label: "Turn",
		numeric: !0
	},
	{ label: "Time" },
	{ label: "Effort" },
	...Df.map((e) => ({
		label: e.label,
		numeric: !0
	})),
	{
		label: "Context",
		numeric: !0
	},
	{
		label: "Growth",
		numeric: !0
	},
	{ label: "Cache rebuild" }
];
function ep(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e, n) => {
		let r = t.get(e.message_id) ?? 0;
		return t.set(e.message_id, r + 1), {
			key: r ? `${e.message_id}#${r}` : e.message_id,
			cells: [
				Y(n + 1),
				Z(e.ts),
				e.effort || "–",
				...Df.map((t) => Y(e[t.field])),
				Y(e.context),
				e.growth === null ? "–" : Sa(e.growth),
				e.rebuild ? `${e.rebuild.cause} · ${J(e.rebuild.lost)}` : "–"
			]
		};
	});
}
function tp(e) {
	let { overhead: t, rebuilds: n } = e, r = Object.entries(Of).map(([t, n]) => [n, e.compactions.filter((e) => e.trigger === t).length]).filter(([, e]) => e).map(([e, t]) => `${Y(t)} ${e}`), i = e.context_per_turn.map((e) => e.growth).filter((e) => e !== null), a = i.length ? i.reduce((e, t) => e + t, 0) / i.length : null;
	return [
		{
			label: "Fixed overhead",
			value: t ? J(t.tokens) : "–",
			note: t ? `the first call's context (system prompt, tools, CLAUDE.md); reading it again cost ${X(t.cost)}` : "no turns"
		},
		{
			label: "Cache rebuilds",
			value: Y(n.count),
			note: n.count ? `${J(n.lost)} tokens written again, ${X(n.cost)} extra` : "every turn read the previous context from the cache"
		},
		{
			label: "Compactions",
			value: Y(e.compactions.length),
			note: r.length ? r.join(", ") : "none"
		},
		{
			label: "Growth per turn",
			value: a === null ? "–" : Sa(Math.round(a)),
			note: "mean of what each turn added beyond the last reply: tool results, prompts, attachments"
		}
	];
}
function np(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.tool) ?? {
			calls: 0,
			chars: 0
		};
		e.calls += 1, e.chars += n.result_chars, t.set(n.tool, e);
	}
	return [...t].map(([e, t]) => `${e}${t.calls > 1 ? ` ×${t.calls}` : ""} ${J(t.chars)}`).join(", ");
}
var rp = [
	{
		label: "Turn",
		numeric: !0
	},
	{ label: "Time" },
	{
		label: "Growth",
		numeric: !0
	},
	{ label: "Tools the call before ran (result characters)" }
];
function ip(e) {
	let t = new Map(e.context_per_turn.map((e, t) => [e.message_id, t + 1]));
	return e.top_growth.map((e) => ({
		key: e.message_id,
		cells: [
			Y(t.get(e.message_id) ?? null),
			Z(e.ts),
			J(e.growth),
			e.tools.length ? np(e.tools) : "none: a prompt or attachments"
		]
	}));
}
function ap(e) {
	if (!e || !e.compactions) return null;
	let t = e.net >= 0;
	return {
		tone: t ? "gain" : "loss",
		title: "Each compaction against keeping its context, over its stretch up to the next one, summed; a stretch not paid off yet as it stands, forced compactions left out" + (e.unknown ? `, ${Y(e.unknown)} without an estimate not summed` : "") + ".",
		text: t ? `▲ saved ~${X(e.net)} so far` : `▼ cost ~${X(-e.net)} more so far`
	};
}
function op(e) {
	return ap(qc(e));
}
var sp = [
	{ label: "Time" },
	{ label: "Trigger" },
	{
		label: "Before",
		numeric: !0
	},
	{
		label: "After",
		numeric: !0
	},
	{
		label: "Took",
		numeric: !0
	},
	{
		label: "Each later call",
		numeric: !0
	},
	{
		label: "Cost once",
		numeric: !0
	},
	{
		label: "Pays off at",
		numeric: !0
	},
	{
		label: "Calls after",
		numeric: !0
	},
	{ label: "Versus keeping" }
];
function cp(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e) => {
		let n = `${e.ts}|${e.trigger}`, r = t.get(n) ?? 0;
		t.set(n, r + 1);
		let i = e.versus_keeping, a = {
			text: J(e.next_context ?? e.post_tokens),
			title: `Claude Code reports ${J(e.post_tokens)}: without the system prompt, tools and CLAUDE.md the next call sends again`
		};
		return {
			key: r ? `${n}#${r}` : n,
			time: Z(e.ts),
			trigger: Of[e.trigger ?? ""] || e.trigger || "–",
			before: J(e.pre_tokens),
			after: a,
			took: wa(e.duration_ms),
			versus: i ? {
				each: i.difference > 0 ? `−${J(i.difference)} · ${X(i.saving_per_call)}` : `+${J(Math.abs(i.difference))} · nothing saved`,
				oneTime: {
					text: tl(i),
					title: nl(i)
				},
				paysOff: {
					text: $c(i) ?? "–",
					title: (i.breakeven_call ?? 0) > i.calls_after ? "projected past the last call" : null
				},
				callsAfter: {
					text: Y(i.calls_after),
					title: i.last_stretch ? "up to the last call" : "up to the next compaction"
				},
				verdict: {
					text: Zc(i),
					tone: Kc(i),
					words: Qc(i),
					title: rl(i)
				}
			} : null
		};
	});
}
//#endregion
//#region src/components/ContextChart.svelte
var lp = /* @__PURE__ */ V([["path"], ["path", {
	fill: "none",
	stroke: "var(--surface)",
	"stroke-width": "2",
	"stroke-linejoin": "round"
}]], 5), up = /* @__PURE__ */ V([["rect"]], 4), dp = /* @__PURE__ */ V([["line", { class: "reference-line" }], [
	"text",
	{ class: "axis-text" },
	" "
]], 5), fp = /* @__PURE__ */ V([[
	"text",
	{
		"text-anchor": "middle",
		class: "axis-text"
	},
	" "
]], 4), pp = /* @__PURE__ */ V([["line", { class: "compaction-rule" }], ,], 5), mp = /* @__PURE__ */ V([[
	"text",
	{ class: "value-text" },
	" "
]], 4), hp = /* @__PURE__ */ V([
	,
	,
	,
	["line", { stroke: "var(--axis)" }],
	,
	,
	,
	,
], 5), gp = /* @__PURE__ */ V([["line", { class: "crosshair" }], ,], 5), _p = /* @__PURE__ */ V([[
	"div",
	{ class: "row" },
	,
	" ",
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "name" },
		" "
	]
]]), vp = /* @__PURE__ */ V([[
	"div",
	{ class: "name" },
	" "
]]), yp = /* @__PURE__ */ V([
	[
		"div",
		{ class: "when" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "row" },
		["span", { class: "key" }],
		" ",
		[
			"strong",
			null,
			" "
		],
		" ",
		[
			"span",
			{ class: "name" },
			"context"
		]
	],
	" ",
	,
], 1);
function bp(e, t) {
	E(t, !0);
	let n = (e, n = v) => {
		let r = /* @__PURE__ */ O(() => n() - 64), i = /* @__PURE__ */ O(() => Ra(t.turns.length, 56, z(r))), a = /* @__PURE__ */ O(() => Gf(t.hintTokens, z(o), z(s))), l = /* @__PURE__ */ O(() => qf(t.compactions, t.turns, z(i)));
		var u = hp(), d = N(u);
		{
			let e = /* @__PURE__ */ O(() => Ia(z(o), 4));
			Zs(d, {
				get left() {
					return 56;
				},
				get right() {
					return z(r);
				},
				get values() {
					return z(e);
				},
				get yOf() {
					return z(s);
				},
				get format() {
					return J;
				}
			});
		}
		var f = F(d);
		K(f, 17, () => Wf(t.turns, z(i), z(s)), (e) => e.part.field, (e, t) => {
			var n = H(), r = N(n), i = (e) => {
				var n = lp(), r = N(n), i = F(r);
				I(() => {
					q(r, "d", z(t).area), q(r, "fill", z(t).part.color), q(i, "d", z(t).edge);
				}), U(e, n);
			}, a = (e) => {
				var n = up();
				I(() => {
					q(n, "x", z(t).x), q(n, "y", z(t).y), q(n, "width", z(t).width), q(n, "height", z(t).height), q(n, "fill", z(t).part.color);
				}), U(e, n);
			};
			G(r, (e) => {
				z(t).kind === "area" ? e(i) : e(a, -1);
			}), U(e, n);
		});
		var p = F(f), m = F(p), h = (e) => {
			var t = dp(), n = N(t), i = F(n), o = P(i, !0);
			I(() => {
				q(n, "x1", 56), q(n, "x2", z(r)), q(n, "y1", z(a).y), q(n, "y2", z(a).y), q(i, "x", z(r) + 6), q(i, "y", z(a).y + 4), W(o, z(a).text);
			}), U(e, t);
		};
		G(m, (e) => {
			z(a) && e(h);
		});
		var g = F(m);
		K(g, 17, () => z(l), (e) => e.key, (e, t) => {
			var n = pp(), r = N(n), i = F(r), a = (e) => {
				var n = fp(), r = P(n, !0);
				I(() => {
					q(n, "x", z(t).x), q(n, "y", 10), W(r, z(t).label);
				}), U(e, n);
			};
			G(i, (e) => {
				z(t).label && e(a);
			}), I(() => {
				q(r, "x1", z(t).x), q(r, "x2", z(t).x), q(r, "y1", 14), q(r, "y2", 178);
			}), U(e, n);
		});
		var _ = F(g);
		K(_, 17, () => Jf(z(c), z(i), z(s), z(l).map((e) => e.x)), (e) => e.key, (e, t) => {
			var n = mp(), r = P(n, !0);
			I(() => {
				q(n, "x", z(t).x), q(n, "y", z(t).y), q(n, "text-anchor", z(t).anchor), W(r, z(t).text);
			}), U(e, n);
		});
		var y = F(_);
		{
			let e = /* @__PURE__ */ O(() => 196);
			Ys(y, {
				get count() {
					return t.turns.length;
				},
				get xOf() {
					return z(i);
				},
				get y() {
					return z(e);
				},
				text: (e) => e === 0 ? "turn 1" : String(e + 1),
				most: 6
			});
		}
		I((e, t) => {
			q(p, "x1", e), q(p, "x2", t), q(p, "y1", 178), q(p, "y2", 178);
		}, [() => z(i)(0), () => z(i)(t.turns.length - 1)]), U(e, u);
	}, r = (e, n = v, r = v) => {
		let i = /* @__PURE__ */ O(() => Ra(t.turns.length, 56, n() - 64)(r()));
		var a = gp(), o = N(a), l = F(o);
		{
			let e = /* @__PURE__ */ O(() => z(s)(z(c)[r()] ?? 0));
			Yl(l, {
				get x() {
					return z(i);
				},
				get y() {
					return z(e);
				},
				color: "var(--context-new)"
			});
		}
		I(() => {
			q(o, "x1", z(i)), q(o, "x2", z(i)), q(o, "y1", 18), q(o, "y2", 178);
		}), U(e, a);
	}, i = (e, n = v) => {
		let r = /* @__PURE__ */ O(() => t.turns[n()]);
		var i = H(), a = N(i), o = (e) => {
			var i = yp(), a = N(i), o = P(a, !0), s = F(a, 2);
			K(s, 17, () => Df.toReversed(), (e) => e.field, (e, t) => {
				var n = _p(), i = M(n);
				Ds(i, { get fill() {
					return z(t).color;
				} });
				var a = F(i, 2), o = P(a, !0), s = P(F(a, 2), !0);
				T(n), I((e) => {
					W(o, e), W(s, z(t).label);
				}, [() => J(z(r)[z(t).field])]), U(e, n);
			});
			var c = F(s, 2), l = P(F(M(c), 2), !0);
			je(2), T(c), K(F(c, 2), 16, () => Xf(z(r)), (e) => e, (e, t) => {
				var n = vp(), r = P(n, !0);
				I(() => W(r, t)), U(e, n);
			}), I((e, t) => {
				W(o, e), W(l, t);
			}, [() => Yf(t.turns, n()), () => J(z(r).context)]), U(e, i);
		};
		G(a, (e) => {
			z(r) && e(o);
		}), U(e, i);
	}, a = /* @__PURE__ */ O(() => Wi(t.containerWidth)), o = /* @__PURE__ */ O(() => Hf(t.turns)), s = /* @__PURE__ */ O(() => Uf(z(o))), c = /* @__PURE__ */ O(() => t.turns.map((e) => e.context)), l = /* @__PURE__ */ O(() => ({
		count: t.turns.length,
		label: "Context per turn by part; arrow keys step through the turns",
		valueText: (e) => Qf(t.turns, e),
		area: (e) => ({
			x: 56,
			y: 0,
			width: e - 64 - 56,
			height: 178
		}),
		indexAt: (e) => za(56, e - 64, t.turns.length),
		tipX: (e, n) => Ra(t.turns.length, 56, e - 64)(n)
	}));
	Ss(e, {
		get height() {
			return Vf;
		},
		get label() {
			return t.label;
		},
		get width() {
			return z(a);
		},
		get containerWidth() {
			return t.containerWidth;
		},
		get cursor() {
			return z(l);
		},
		get plot() {
			return n;
		},
		get marks() {
			return r;
		},
		get tip() {
			return i;
		}
	}), D();
}
//#endregion
//#region src/components/StatTile.svelte
var xp = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), Sp = /* @__PURE__ */ V([[
	"div",
	{ class: "card" },
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	[
		"div",
		{ class: "tile-value" },
		" "
	],
	" ",
	,
]]);
function Cp(e, t) {
	E(t, !0);
	let n = Bi(t, "note", 3, null), r = Bi(t, "themedNote", 3, !1);
	var i = Sp(), a = M(i), o = P(a, !0), s = F(a, 2), c = P(s, !0), l = F(s, 2), u = (e) => {
		var t = xp(), i = P(t, !0);
		I((e) => W(i, e), [() => r() ? $(n()) : n()]), U(e, t);
	};
	G(l, (e) => {
		n() && e(u);
	}), T(i), I((e) => {
		W(o, e), W(c, t.value);
	}, [() => $(t.label)]), U(e, i), D();
}
//#endregion
//#region src/components/ContextDetails.svelte
var wp = (e) => {
	U(e, Dp());
}, Tp = (e, t = v) => {
	var n = H();
	K(N(n), 19, () => rp, (e) => e.label, (e, n, r) => {
		var i = Op(), a = P(i, !0);
		I(() => {
			fi(i, 1, oi(z(n).numeric ? "num" : void 0)), W(a, t().cells[z(r)]);
		}), U(e, i);
	}), U(e, n);
}, Ep = (e, t = v) => {
	var n = Np(), r = N(n), i = P(r, !0), a = F(r, 2), o = P(a, !0), s = F(a, 2), c = P(s, !0), l = F(s, 2), u = P(l, !0), d = F(l, 2), f = P(d, !0), p = F(d, 2), m = (e) => {
		let n = /* @__PURE__ */ O(() => t().versus);
		var r = jp(), i = N(r), a = P(i, !0), o = F(i, 2), s = P(o, !0), c = F(o, 2), l = P(c, !0), u = F(c, 2), d = P(u, !0), f = F(u, 2), p = M(f), m = P(p, !0);
		T(f), I(() => {
			W(a, z(n).each), q(o, "title", z(n).oneTime.title), W(s, z(n).oneTime.text), q(c, "title", z(n).paysOff.title), W(l, z(n).paysOff.text), q(u, "title", z(n).callsAfter.title), W(d, z(n).callsAfter.text), q(f, "title", z(n).verdict.title), fi(p, 1, oi(z(n).verdict.tone ? `verdict-${z(n).verdict.tone}` : void 0)), q(p, "title", z(n).verdict.words), W(m, z(n).verdict.text);
		}), U(e, r);
	}, h = (e) => {
		U(e, Mp());
	};
	G(p, (e) => {
		t().versus ? e(m) : e(h, -1);
	}), I(() => {
		W(i, t().time), W(o, t().trigger), W(c, t().before), q(l, "title", t().after.title), W(u, t().after.text), W(f, t().took);
	}), U(e, n);
}, Dp = /* @__PURE__ */ V([[
	"h3",
	null,
	"Biggest growth steps"
]]), Op = /* @__PURE__ */ V([[
	"td",
	null,
	" "
]]), kp = /* @__PURE__ */ V([[
	"span",
	null,
	" "
]]), Ap = /* @__PURE__ */ V([[
	"h3",
	null,
	"Compactions",
	,
]]), jp = /* @__PURE__ */ V([
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"span",
			null,
			" "
		]
	]
], 1), Mp = /* @__PURE__ */ V([[
	"td",
	{
		colspan: "5",
		class: "muted"
	},
	"no call after it, or no price for its model"
]]), Np = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	[
		"td",
		{ class: "num" },
		" "
	],
	" ",
	,
], 1), Pp = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), Fp = /* @__PURE__ */ V([
	["div", { class: "kpis session-kpis" }],
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function Ip(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Ap(), n = F(M(t)), r = (e) => {
			var t = kp(), n = P(t, !0);
			I(() => {
				fi(t, 1, `compaction-total verdict-${z(a).tone ?? ""}`), q(t, "title", z(a).title), W(n, z(a).text);
			}), U(e, t);
		};
		G(n, (e) => {
			z(a) && e(r);
		}), T(t), U(e, t);
	}, r = /* @__PURE__ */ O(() => ip(t.agent)), i = /* @__PURE__ */ O(() => cp(t.agent.compactions)), a = /* @__PURE__ */ O(() => op(t.agent.compactions));
	var o = Fp(), s = N(o);
	K(s, 21, () => tp(t.agent), (e) => e.label, (e, t) => {
		Cp(e, {
			get label() {
				return z(t).label;
			},
			get value() {
				return z(t).value;
			},
			get note() {
				return z(t).note;
			}
		});
	}), T(s);
	var c = F(s, 2);
	qs(c, {
		get key() {
			return `${t.key ?? ""}-growth`;
		},
		get columns() {
			return rp;
		},
		get rows() {
			return z(r);
		},
		rowKey: (e) => e.key,
		get cells() {
			return Tp;
		},
		get heading() {
			return wp;
		},
		get empty() {
			return Af;
		}
	});
	var l = F(c, 2);
	qs(l, {
		get key() {
			return `${t.key ?? ""}-compactions`;
		},
		get columns() {
			return sp;
		},
		get rows() {
			return z(i);
		},
		rowKey: (e) => e.key,
		get cells() {
			return Ep;
		},
		get heading() {
			return n;
		},
		get empty() {
			return jf;
		}
	});
	var u = F(l, 2), d = (e) => {
		var t = Pp(), n = P(t, !0);
		I(() => W(n, Mf)), U(e, t);
	};
	G(u, (e) => {
		z(i).length && e(d);
	}), U(e, o), D();
}
//#endregion
//#region src/components/ContextPerTurn.svelte
var Lp = (e, t = v) => {
	var n = H();
	K(N(n), 19, () => $f, (e) => e.label, (e, n, r) => {
		var i = Rp(), a = P(i, !0);
		I(() => {
			fi(i, 1, oi(z(n).numeric ? "num" : void 0)), W(a, t().cells[z(r)]);
		}), U(e, i);
	}), U(e, n);
}, Rp = /* @__PURE__ */ V([[
	"td",
	null,
	" "
]]), zp = /* @__PURE__ */ V([[
	"option",
	null,
	" "
]]), Bp = /* @__PURE__ */ V([["optgroup"]]), Vp = /* @__PURE__ */ V([[
	"option",
	null,
	" "
]]), Hp = /* @__PURE__ */ V([["select", {
	id: "context-agent",
	"aria-label": "Transcript the context section shows"
}]]), Up = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), Wp = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), Gp = /* @__PURE__ */ V([
	[
		"div",
		{ class: "chart-head" },
		[
			"h3",
			null,
			"Context per turn"
		],
		" ",
		[
			"span",
			{
				id: "context-note",
				class: "muted"
			},
			" "
		],
		" ",
		["span", { class: "spacer" }],
		" ",
		,
		" ",
		[
			"button",
			{
				type: "button",
				id: "context-table-toggle"
			},
			"Table view"
		]
	],
	" ",
	[
		"div",
		{ class: "legend" },
		,
		" ",
		[
			"span",
			null,
			["span", { class: "legend-rule" }],
			"compaction"
		]
	],
	" ",
	[
		"div",
		{
			id: "context-chart",
			class: "chart"
		},
		,
	],
	" ",
	,
	" ",
	[
		"div",
		{ id: "context-details" },
		,
	]
], 1);
function Kp(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => Q.session), r = /* @__PURE__ */ A("main"), i = /* @__PURE__ */ A(!1), a = /* @__PURE__ */ A(0), o = /* @__PURE__ */ O(() => z(n) ? If(z(n).agents, z(r)) : null), s = /* @__PURE__ */ O(() => z(o)?.context_per_turn ?? []), c = /* @__PURE__ */ O(() => z(n) ? Lf(z(n).agents) : []), l = /* @__PURE__ */ O(() => z(n) ? Rf(z(n).session_id, z(o)) : ""), u = /* @__PURE__ */ O(() => ep(z(s)));
	var d = H(), f = N(d), p = (e) => {
		var t = Gp(), d = N(t), f = F(M(d), 2), p = P(f, !0), m = F(f, 4), h = (e) => {
			var t = Hp();
			K(t, 21, () => z(c), (e) => e.kind === "group" ? `group:${e.key}` : e.value, (e, t) => {
				var n = H(), r = N(n), i = (e) => {
					var n = Bp();
					K(n, 21, () => z(t).options, (e) => e.value, (e, t) => {
						var n = zp(), r = P(n, !0), i = {};
						I(() => {
							W(r, z(t).label), i !== (i = z(t).value) && (n.value = (n.__value = i) ?? "");
						}), U(e, n);
					}), T(n), I(() => q(n, "label", z(t).label)), U(e, n);
				}, a = (e) => {
					var n = Vp(), r = P(n, !0), i = {};
					I(() => {
						W(r, z(t).label), i !== (i = z(t).value) && (n.value = (n.__value = i) ?? "");
					}), U(e, n);
				};
				G(r, (e) => {
					z(t).kind === "group" ? e(i) : e(a, -1);
				}), U(e, n);
			}), T(t), vi(t), yi(t, () => z(o) ? Nf(z(o)) : z(r), (e) => j(r, e, !0)), U(e, t);
		};
		G(m, (e) => {
			z(c).length && e(h);
		});
		var g = F(m, 2);
		T(d);
		var _ = F(d, 2);
		K(M(_), 17, () => Df.toReversed(), (e) => e.field, (e, t) => {
			var n = Up(), r = M(n);
			Ds(r, { get fill() {
				return z(t).color;
			} });
			var i = F(r, 1, !0);
			T(n), I(() => W(i, z(t).label)), U(e, n);
		}), je(2), T(_);
		var v = F(_, 2), y = M(v), ee = (e) => {
			{
				let t = /* @__PURE__ */ O(() => Bf(z(o), z(s)));
				bp(e, {
					get turns() {
						return z(s);
					},
					get compactions() {
						return z(o).compactions;
					},
					get hintTokens() {
						return z(n).compact_hint_tokens;
					},
					get label() {
						return z(t);
					},
					get containerWidth() {
						return z(a);
					}
				});
			}
		}, b = (e) => {
			var t = Wp(), n = P(t, !0);
			I(() => W(n, kf)), U(e, t);
		};
		G(y, (e) => {
			z(o) && z(s).length ? e(ee) : e(b, -1);
		}), T(v);
		var x = F(v, 2), S = (e) => {
			qs(e, {
				id: "context-table",
				get key() {
					return `${z(l) ?? ""}-turns`;
				},
				get columns() {
					return $f;
				},
				get rows() {
					return z(u);
				},
				rowKey: (e) => e.key,
				get cells() {
					return Lp;
				},
				get empty() {
					return kf;
				}
			});
		};
		G(x, (e) => {
			z(i) && e(S);
		});
		var te = F(x, 2), ne = M(te), re = (e) => {
			Ip(e, {
				get agent() {
					return z(o);
				},
				get key() {
					return z(l);
				}
			});
		};
		G(ne, (e) => {
			z(o) && e(re);
		}), T(te), I((e) => {
			W(p, e), q(g, "aria-pressed", z(i));
		}, [() => zf(z(o))]), B("click", g, () => j(i, !z(i))), Fi(v, "clientWidth", (e) => j(a, e)), U(e, t);
	};
	G(f, (e) => {
		z(n) && e(p);
	}), U(e, d), D();
}
Tr(["click"]);
//#endregion
//#region src/lib/conversation.ts
function qp(e, t) {
	let n = t ? `?agent=${encodeURIComponent(t)}` : "";
	return `/api/session/${encodeURIComponent(e)}/chat${n}`;
}
function Jp(e) {
	return e ? "Oldest first: click for newest first" : "Newest first: click for oldest first";
}
function Yp(e) {
	let t = e.agent_id === null ? "Main thread" : `${e.agent_type}${e.description ? ` · ${e.description}` : ""}`;
	return {
		value: e.agent_id ?? "",
		label: t
	};
}
function Xp(e) {
	let t = [], n = /* @__PURE__ */ new Map();
	for (let r of e) {
		if (r.agent_type === "(background)") continue;
		if (r.workflow_run === null) {
			t.push(Yp(r));
			continue;
		}
		let e = n.get(r.workflow_run);
		e || (e = {
			group: `workflow · ${r.workflow_name || r.workflow_run}`,
			options: []
		}, n.set(r.workflow_run, e), t.push(e)), e.options.push(Yp(r));
	}
	return t;
}
function Zp(e) {
	return e?.calls ? `Claude Code's token reminder went with ${Y(e.calls)} calls, ${Y(e.chars)} characters in all; each call's badge counts it (hover the badge).` : null;
}
function Qp(e) {
	return e.available ? e.entries.length ? null : "No conversation in this transcript yet." : "The transcript is gone: Claude Code deleted it after its cleanup period. The usage history stays.";
}
function $p(e, t) {
	return JSON.stringify(e) === JSON.stringify(t);
}
function em(e, t) {
	if (!e) return t;
	let n = t.entries.map((t, n) => {
		let r = e.entries[n];
		return r && JSON.stringify(r) === JSON.stringify(t) ? r : t;
	});
	return {
		...t,
		entries: n
	};
}
//#endregion
//#region src/lib/http.ts
async function tm(e) {
	let t = await fetch(e, { cache: "no-store" }), n;
	try {
		n = await t.json();
	} catch {
		throw Error(`${e}: HTTP ${t.status}, not JSON`);
	}
	if (t.status === 403) throw Error(n.error || "HTTP 403");
	if (!t.ok) throw Error(`${e}: ${n.error || `HTTP ${t.status}`}`);
	return n;
}
//#endregion
//#region src/lib/entries.ts
var nm = {
	prompt: "You",
	text: "Claude",
	thinking: "Thinking"
};
function rm(e) {
	return nm[e] ?? e;
}
function im(e) {
	return e.kind === "prompt" ? "" : [e.model, e.effort ? `effort ${e.effort}` : null].filter(Boolean).join(" · ");
}
function am(e, t) {
	return t > e.length ? ` · first ${Y(e.length)} of ${Y(t)} characters` : "";
}
var om = /<command-name>([^<]*)<\/command-name>/, sm = /<command-args>([^<]*)<\/command-args>/;
function cm(e) {
	let t = e.match(om);
	if (t) {
		let n = (e.match(sm) ?? [])[1] ?? "";
		return {
			kind: "command",
			text: `${(t[1] ?? "").trim()} ${n.trim()}`.trim()
		};
	}
	let n = lm(e);
	return n === null ? {
		kind: "markdown",
		text: e
	} : {
		kind: "json",
		code: n
	};
}
function lm(e) {
	let t = e.trim();
	if (!t.startsWith("{") && !t.startsWith("[")) return null;
	try {
		return JSON.stringify(JSON.parse(t), null, 2);
	} catch {
		return null;
	}
}
var um = {
	py: "python",
	js: "javascript",
	mjs: "javascript",
	cjs: "javascript",
	jsx: "javascript",
	ts: "typescript",
	tsx: "typescript",
	json: "json",
	sh: "bash",
	bash: "bash",
	zsh: "bash",
	php: "php",
	rb: "ruby",
	go: "go",
	rs: "rust",
	java: "java",
	kt: "kotlin",
	swift: "swift",
	c: "c",
	h: "c",
	cpp: "cpp",
	hpp: "cpp",
	cs: "csharp",
	css: "css",
	scss: "scss",
	less: "less",
	html: "xml",
	xml: "xml",
	svg: "xml",
	vue: "xml",
	md: "markdown",
	yml: "yaml",
	yaml: "yaml",
	toml: "ini",
	ini: "ini",
	cfg: "ini",
	sql: "sql",
	lua: "lua",
	pl: "perl",
	r: "r",
	graphql: "graphql",
	diff: "diff",
	patch: "diff",
	mk: "makefile"
}, dm = {
	Makefile: "makefile",
	Dockerfile: "bash",
	".bashrc": "bash",
	".zshrc": "bash"
};
function fm(e) {
	if (!e) return null;
	let t = e.split("/").pop() ?? "", n = dm[t];
	if (n) return n;
	let r = t.lastIndexOf(".");
	return r > 0 ? um[t.slice(r + 1).toLowerCase()] ?? null : null;
}
function pm(e) {
	return e ? um[e] ?? e : null;
}
function mm(e) {
	return Object.fromEntries((e.tool_fields ?? []).map((e) => [e.name, e]));
}
function hm(e) {
	let t = mm(e).description;
	return (e.tool === "Bash" && t ? t.value : e.summary) ?? "";
}
function gm(e) {
	return e.result === null ? " · no result yet" : e.is_error ? " · ⚠ failed" : "";
}
function _m(e, t) {
	let n = (e) => e ? e.split("\n") : [];
	return [...n(e).map((e) => `- ${e}`), ...n(t).map((e) => `+ ${e}`)].join("\n");
}
function vm(e) {
	return e.map((e) => {
		let t = e.value.includes("\n");
		return {
			name: e.name,
			label: `${e.name}${am(e.value, e.chars)}`,
			value: e.value,
			shape: e.is_json ? "json" : t ? "block" : "line",
			inline: !t
		};
	});
}
function ym(e) {
	let t = mm(e), n = e.tool_fields ?? [], r = (e) => vm(n.filter((t) => !e.includes(t.name))), { command: i, description: a, file_path: o, old_string: s, new_string: c, content: l } = t;
	if (e.tool === "Bash" && i) return {
		kind: "bash",
		description: a ? a.value : null,
		label: `Command${am(i.value, i.chars)}`,
		command: i.value,
		rest: r(["command", "description"])
	};
	if (e.tool === "Edit" && o && (s || c)) {
		let e = s ?? {
			value: "",
			chars: 0
		}, t = c ?? {
			value: "",
			chars: 0
		}, n = e.chars > e.value.length || t.chars > t.value.length;
		return {
			kind: "edit",
			path: o.value,
			label: `Change${n ? " · cut to the first 4,000 characters of each side" : ""}`,
			diff: _m(e.value, t.value),
			rest: r([
				"file_path",
				"old_string",
				"new_string"
			])
		};
	}
	return e.tool === "Write" && o && l ? {
		kind: "write",
		path: o.value,
		label: `Content${am(l.value, l.chars)}`,
		content: l.value,
		language: fm(o.value),
		rest: r(["file_path", "content"])
	} : {
		kind: "fields",
		label: "Input",
		rest: vm(n)
	};
}
function bm(e) {
	let t = e.result ?? "";
	if (e.result_chars <= t.length) {
		let e = lm(t);
		if (e !== null) return {
			kind: "code",
			code: e,
			language: "json"
		};
	}
	let n = mm(e).file_path;
	return e.tool === "Read" && n && !e.is_error ? {
		kind: "code",
		code: t,
		language: fm(n.value)
	} : {
		kind: "text",
		text: t
	};
}
function xm(e) {
	return `Result${am(e.result ?? "", e.result_chars)}`;
}
var Sm = {
	meta: "meta record",
	skill: "skill text",
	summary: "compact summary"
};
function Cm(e) {
	return Sm[e] ?? e.replaceAll("_", " ");
}
function wm(e) {
	let t = e.reduce((e, t) => e + t.chars, 0);
	return `${e.length === 1 ? "1 item" : `${Y(e.length)} items`} · ${Y(t)} characters`;
}
function Tm(e) {
	let t = e.compaction ?? {
		trigger: null,
		pre_tokens: null,
		post_tokens: null,
		duration_ms: null
	}, n = [e.text ?? ""];
	if (t.trigger && n.push(t.trigger), t.pre_tokens !== null) {
		let r = e.versus_keeping ? `next call ${J(e.versus_keeping.after)}` : `${J(t.post_tokens)} tokens`;
		n.push(`${J(t.pre_tokens)} → ${r}`);
	}
	return t.duration_ms && n.push(`took ${wa(t.duration_ms)}`), n.join(" · ");
}
function Em(e) {
	return e.kind === "error" ? `⚠ API error: ${e.text ?? ""}` : Tm(e);
}
function Dm(e) {
	return [
		el(e),
		`${Y(e.calls_after)} calls after`,
		`cost ${tl(e)} once`
	].filter(Boolean).join(" · ");
}
function Om(e) {
	return ` (${Sa(e)})`;
}
function km(e) {
	if (e.growth === null || e.growth === void 0) return "";
	if (!e.reply) return Om(e.growth);
	let t = e.growth < 0 ? Sa(e.growth) : J(e.growth);
	return ` (${Sa(e.reply + e.growth)}: reply ${J(e.reply)}, added ${t})`;
}
function Am(e) {
	let t = [`context ${J(e.context)}${km(e)}`, `in ${J(e.new_input)}`];
	return e.cache_write && t.push(`cache write ${J(e.cache_write)}`), e.cache_read && t.push(`cache read ${J(e.cache_read)}`), t.push(`out ${J(e.output)}`), e.web_searches && t.push(`${Y(e.web_searches)} web searches`), e.speed !== "standard" && t.push("fast mode"), t;
}
function jm(e) {
	return e.cost === null ? "no price" : X(e.cost);
}
function Mm(e) {
	return e.reminder_chars ? `The context includes Claude Code's token reminder (${Y(e.reminder_chars)} characters)` : null;
}
function Nm(e) {
	return e !== void 0 && e.kind.endsWith("_reminder");
}
function Pm(e) {
	return e?.kind === "auto_reminder" ? "chat-usage-remind-auto" : e?.kind === "pays_reminder" ? "chat-usage-remind-pays" : e?.kind === "soft_reminder" ? "chat-usage-remind" : "";
}
function Fm(e) {
	return e.kind === "auto_reminder" ? {
		tone: "compact-chip-auto",
		text: `⚠ ${Ca(e.context, e.auto_compact)} of auto-compact (${J(e.auto_compact)})`
	} : e.kind === "pays_reminder" ? {
		tone: "compact-chip-pays",
		text: `⚠ ${J(e.context)} · compacting pays after ~${e.pays_off_in} replies`
	} : e.kind === "soft_reminder" ? {
		tone: "",
		text: `ℹ ${J(e.context)} · ${e.times}× your ${J(e.threshold)} hint`
	} : {
		tone: "",
		text: ""
	};
}
function Im(e) {
	let t = e.extra_cost === null ? "" : ` · +${X(e.extra_cost)}`;
	return {
		text: `↻ cache rebuilt (${e.cause}) · ${J(e.lost)}${t}`,
		title: `${J(e.lost)} tokens written to the cache again: ${Jc[e.cause]}`
	};
}
function Lm(e) {
	if (e === void 0) return null;
	if (e.kind === "pays") {
		let t = e.ahead_from === "longer" ? `After your past compactions, a stretch this long went on for about ${e.calls_ahead} more on average.` : `After your past compactions you went on for about ${e.calls_ahead} replies on average.`;
		return {
			tone: "compact-pays",
			label: "⚠ Compacting pays on average",
			text: `Context ${J(e.context)}, and every reply reads all of it again. /compact would shrink it to about ${J(e.after)}. That costs ~${X(e.one_time)} once, and the cheaper replies pay it back within about ${e.pays_off_in} replies. ${t}`
		};
	}
	if (e.kind === "auto") return {
		tone: "compact-auto",
		label: "⚠ Compact soon",
		text: `Context ${J(e.context)}: ${Ca(e.context, e.auto_compact)} of the ${J(e.auto_compact)} where Claude Code auto-compacts. /compact now to choose what to keep.`
	};
	if (e.kind !== "soft") return null;
	let t = e.reread_cost ? `: this turn cost ${X(e.reread_cost)} in cache reads` : "";
	return {
		tone: "",
		label: "ℹ Consider compacting",
		text: `Context ${J(e.context)}, over the ${J(e.threshold)} hint (a heuristic, [chat] compact_hint_tokens in config.toml). Every turn re-reads it${t}. /compact, or /clear when the task changes.`
	};
}
//#endregion
//#region src/components/ChatInjected.svelte
var Rm = /* @__PURE__ */ V([
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	[
		"pre",
		{ class: "code" },
		" "
	]
], 1), zm = /* @__PURE__ */ V([[
	"details",
	{ class: "chat-tool chat-injected" },
	[
		"summary",
		null,
		[
			"strong",
			null,
			"Added to the context"
		],
		" ",
		[
			"span",
			{ class: "muted" },
			" "
		]
	],
	" ",
	,
]]);
function Bm(e, t) {
	E(t, !0);
	var n = zm(), r = M(n), i = F(M(r)), a = P(F(i), !0);
	T(r), K(F(r, 2), 16, () => t.entry.items, (e) => e, (e, t) => {
		var n = Rm(), r = N(n), i = P(r), a = P(F(r, 2), !0);
		I((e, n) => {
			W(i, `${e ?? ""}${n ?? ""}`), W(a, t.text);
		}, [() => Cm(t.kind), () => am(t.text, t.chars)]), U(e, n);
	}), T(n), I((e, t) => {
		W(i, ` ${e ?? ""} `), W(a, t);
	}, [() => wm(t.entry.items), () => Z(t.entry.timestamp)]), U(e, n), D();
}
//#endregion
//#region src/components/ChatMarker.svelte
var Vm = /* @__PURE__ */ V([[
	"div",
	{ class: "muted" },
	"vs keeping: ",
	[
		"span",
		null,
		" "
	],
	" "
]]), Hm = /* @__PURE__ */ V([[
	"div",
	{ class: "chat-marker" },
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	],
	" ",
	,
]]);
function Um(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => t.entry.versus_keeping ?? null), r = /* @__PURE__ */ O(() => z(n) ? Kc(z(n)) : null);
	var i = Hm(), a = M(i), o = F(a), s = P(o, !0), c = F(o, 2), l = (e) => {
		var t = Vm(), i = F(M(t)), a = P(i, !0), o = F(i);
		T(t), I((e, n, s) => {
			q(t, "title", Xc), fi(i, 1, oi(z(r) ? `verdict-${z(r)}` : void 0)), q(i, "title", e), W(a, n), W(o, ` · ${s ?? ""}`);
		}, [
			() => Qc(z(n)) ?? void 0,
			() => Zc(z(n)),
			() => Dm(z(n))
		]), U(e, t);
	};
	G(c, (e) => {
		z(n) && e(l);
	}), T(i), I((e, t) => {
		W(a, `${e ?? ""} `), W(s, t);
	}, [() => Em(t.entry), () => Z(t.entry.timestamp)]), U(e, i), D();
}
//#endregion
//#region src/lib/markup.ts
function Wm() {
	return globalThis;
}
function Gm(e) {
	let t = Wm().hljs;
	return !!(e && t && t.getLanguage(e));
}
function Km(e, t, n) {
	let r = Wm().hljs;
	r && Gm(n) ? e.innerHTML = r.highlight(t, {
		language: n,
		ignoreIllegals: !0
	}).value : e.textContent = t;
}
function qm(e, t) {
	return (n) => {
		Km(n, e, t);
	};
}
var Jm = [
	"p",
	"br",
	"strong",
	"em",
	"del",
	"code",
	"pre",
	"ul",
	"ol",
	"li",
	"blockquote",
	"hr",
	"a",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"table",
	"thead",
	"tbody",
	"tr",
	"th",
	"td"
], Ym = [
	"href",
	"title",
	"class",
	"align",
	"start"
], Xm = /^language-[\w+-]+$/, Zm = /^(?:https?|mailto):/i, Qm = null;
function $m() {
	let { DOMPurify: e, marked: t } = Wm();
	return !t || !e || !e.isSupported ? !1 : Qm === e || (e.addHook("uponSanitizeElement", (e) => {
		e.tagName === "INPUT" && e.getAttribute("type") === "checkbox" && e.replaceWith(e.ownerDocument.createTextNode(e.hasAttribute("checked") ? "☑" : "☐"));
	}), e.addHook("afterSanitizeAttributes", (e) => {
		let t = e.getAttribute("class");
		t !== null && !(e.tagName === "CODE" && Xm.test(t)) && e.removeAttribute("class"), e.tagName === "A" && (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer"));
	}), Qm = e, !0);
}
function eh() {
	return $m();
}
function th(e, t) {
	if (!$m()) return null;
	let { DOMPurify: n, marked: r } = Wm();
	if (!n || !r) return null;
	let i = document.createElement("div");
	i.innerHTML = n.sanitize(r.parse(e, {
		gfm: !0,
		breaks: t,
		async: !1
	}), {
		ALLOWED_TAGS: Jm,
		ALLOWED_ATTR: Ym,
		ALLOWED_URI_REGEXP: Zm
	});
	for (let e of i.querySelectorAll("pre > code")) {
		let t = e.className.match(/\blanguage-([\w+-]+)/)?.[1], n = document.createElement("code");
		n.className = "hljs", Km(n, e.textContent ?? "", pm(t));
		let r = document.createElement("pre");
		r.className = "code", r.append(n), e.parentElement?.replaceWith(r);
	}
	return [...i.childNodes];
}
function nh(e, t = !1) {
	return (n) => {
		n.replaceChildren(...th(e, t) ?? []);
	};
}
//#endregion
//#region src/components/Code.svelte
var rh = /* @__PURE__ */ V([["code", { class: "hljs" }]]), ih = /* @__PURE__ */ V([[
	"pre",
	{ class: "code" },
	,
]]);
function ah(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = rh();
		ri(n, () => qm(t.code, r())), U(e, n);
	}, r = Bi(t, "language", 3, null), i = Bi(t, "inline", 3, !1);
	var a = H(), o = N(a), s = (e) => {
		n(e);
	}, c = (e) => {
		var t = ih(), r = M(t);
		n(r), T(t), U(e, t);
	};
	G(o, (e) => {
		i() ? e(s) : e(c, -1);
	}), U(e, a), D();
}
//#endregion
//#region src/components/Markdown.svelte
var oh = /* @__PURE__ */ V([["div", { class: "chat-markdown" }]]), sh = /* @__PURE__ */ V([[
	"div",
	{ class: "chat-markdown chat-text" },
	" "
]]);
function ch(e, t) {
	E(t, !0);
	let n = Bi(t, "breaks", 3, !1);
	var r = H(), i = N(r), a = (e) => {
		var r = oh();
		ri(r, () => nh(t.text, n())), U(e, r);
	}, o = /* @__PURE__ */ O(() => eh()), s = (e) => {
		var n = sh(), r = P(n, !0);
		I(() => W(r, t.text)), U(e, n);
	};
	G(i, (e) => {
		z(o) ? e(a) : e(s, -1);
	}), U(e, r), D();
}
//#endregion
//#region src/components/ChatMessage.svelte
var lh = /* @__PURE__ */ V([
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	]
], 1), uh = /* @__PURE__ */ V([
	[
		"strong",
		null,
		" "
	],
	" ",
	[
		"span",
		{ class: "muted" },
		" "
	]
], 1), dh = /* @__PURE__ */ V([[
	"details",
	{ class: "chat-entry chat-thinking" },
	[
		"summary",
		null,
		[
			"span",
			{ class: "chat-head" },
			,
		]
	],
	" ",
	[
		"div",
		{ class: "chat-text" },
		" "
	]
]]), fh = /* @__PURE__ */ V([[
	"div",
	{ class: "chat-command" },
	[
		"code",
		null,
		" "
	]
]]), ph = /* @__PURE__ */ V([[
	"div",
	{ class: "chat-text" },
	" "
]]), mh = /* @__PURE__ */ V([[
	"div",
	null,
	[
		"div",
		{ class: "chat-head" },
		,
	],
	" ",
	,
]]);
function hh(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = H(), r = N(n), a = (e) => {
			var n = lh(), r = N(n), a = P(r, !0), o = F(r, 2), s = P(o, !0), c = P(F(o, 2), !0);
			I((e, t) => {
				W(a, e), W(s, z(i)), W(c, t);
			}, [() => rm(t.entry.kind), () => Z(t.entry.timestamp)]), U(e, n);
		}, o = (e) => {
			var n = uh(), r = N(n), i = P(r, !0), a = P(F(r, 2), !0);
			I((e, t) => {
				W(i, e), W(a, t);
			}, [() => rm(t.entry.kind), () => Z(t.entry.timestamp)]), U(e, n);
		};
		G(r, (e) => {
			z(i) ? e(a) : e(o, -1);
		}), U(e, n);
	}, r = /* @__PURE__ */ O(() => t.entry.text ?? ""), i = /* @__PURE__ */ O(() => im(t.entry)), a = /* @__PURE__ */ O(() => t.entry.kind === "prompt" ? cm(z(r)) : null);
	var o = H(), s = N(o), c = (e) => {
		var t = dh(), i = M(t), a = M(i), o = M(a);
		n(o), T(a), T(i);
		var s = P(F(i, 2), !0);
		T(t), I(() => W(s, z(r))), U(e, t);
	}, l = (e) => {
		var i = mh(), o = M(i), s = M(o);
		n(s), T(o);
		var c = F(o, 2), l = (e) => {
			var t = fh(), n = P(M(t), !0);
			T(t), I(() => W(n, z(a).text)), U(e, t);
		}, u = (e) => {
			ah(e, {
				get code() {
					return z(a).code;
				},
				language: "json"
			});
		}, d = (e) => {
			ch(e, {
				get text() {
					return z(a).text;
				},
				breaks: !0
			});
		}, f = (e) => {
			ch(e, { get text() {
				return z(r);
			} });
		}, p = (e) => {
			var t = ph(), n = P(t, !0);
			I(() => W(n, z(r))), U(e, t);
		};
		G(c, (e) => {
			z(a)?.kind === "command" ? e(l) : z(a)?.kind === "json" ? e(u, 1) : z(a) ? e(d, 2) : t.entry.kind === "text" ? e(f, 3) : e(p, -1);
		}), T(i), I(() => fi(i, 1, `chat-entry ${t.entry.kind === "prompt" ? "chat-user" : "chat-assistant"}`)), U(e, i);
	};
	G(s, (e) => {
		t.entry.kind === "thinking" ? e(c) : e(l, -1);
	}), U(e, o), D();
}
//#endregion
//#region src/components/ChatToolCall.svelte
var gh = (e, t = v) => {
	var n = H(), r = N(n), i = (e) => {
		var n = yh();
		K(n, 20, t, (e) => e, (e, t, n, r) => {
			var i = vh(), a = N(i), o = P(a, !0), s = F(a, 2), c = M(s), l = (e) => {
				ah(e, {
					get code() {
						return t.value;
					},
					language: "json",
					get inline() {
						return t.inline;
					}
				});
			}, u = (e) => {
				var n = _h(), r = P(n, !0);
				I(() => W(r, t.value)), U(e, n);
			}, d = (e) => {
				var n = Mr();
				I(() => W(n, t.value)), U(e, n);
			};
			G(c, (e) => {
				t.shape === "json" ? e(l) : t.shape === "block" ? e(u, 1) : e(d, -1);
			}), T(s), I(() => W(o, t.label)), U(e, i);
		}), T(n), U(e, n);
	};
	G(r, (e) => {
		t().length > 0 && e(i);
	}), U(e, n);
}, _h = /* @__PURE__ */ V([[
	"pre",
	{ class: "code" },
	" "
]]), vh = /* @__PURE__ */ V([
	[
		"dt",
		null,
		" "
	],
	" ",
	[
		"dd",
		null,
		,
	]
], 1), yh = /* @__PURE__ */ V([["dl", { class: "tool-fields" }]]), bh = /* @__PURE__ */ V([[
	"div",
	{ class: "tool-description" },
	" "
]]), xh = /* @__PURE__ */ V([
	,
	,
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), Sh = /* @__PURE__ */ V([
	[
		"div",
		{ class: "tool-description" },
		" "
	],
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), Ch = /* @__PURE__ */ V([
	[
		"div",
		{ class: "tool-description" },
		" "
	],
	" ",
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), wh = /* @__PURE__ */ V([[
	"div",
	{ class: "label" },
	" "
]]), Th = /* @__PURE__ */ V([[
	"pre",
	{ class: "code" },
	" "
]]), Eh = /* @__PURE__ */ V([
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	,
], 1), Dh = /* @__PURE__ */ V([[
	"details",
	{ class: "chat-tool" },
	[
		"summary",
		null,
		[
			"strong",
			null,
			" "
		],
		" ",
		[
			"span",
			{ class: "muted" },
			" "
		]
	],
	" ",
	[
		"div",
		null,
		,
		" ",
		,
	],
	" ",
	,
]]);
function Oh(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => `${hm(t.entry) ? ` ${hm(t.entry)}` : ""}${gm(t.entry)}`), r = /* @__PURE__ */ O(() => ym(t.entry)), i = /* @__PURE__ */ O(() => t.entry.result === null ? null : bm(t.entry));
	var a = Dh(), o = M(a), s = M(o), c = P(s, !0), l = F(s), u = P(F(l), !0);
	T(o);
	var d = F(o, 2), f = M(d), p = (e) => {
		var t = xh(), n = N(t), i = (e) => {
			var t = bh(), n = P(t, !0);
			I(() => W(n, z(r).description)), U(e, t);
		};
		G(n, (e) => {
			z(r).description && e(i);
		});
		var a = F(n, 2), o = P(a, !0);
		ah(F(a, 2), {
			get code() {
				return z(r).command;
			},
			language: "bash"
		}), I(() => W(o, z(r).label)), U(e, t);
	}, m = (e) => {
		var t = Sh(), n = N(t), i = P(n, !0), a = F(n, 2), o = P(a, !0);
		ah(F(a, 2), {
			get code() {
				return z(r).diff;
			},
			language: "diff"
		}), I(() => {
			W(i, z(r).path), W(o, z(r).label);
		}), U(e, t);
	}, h = (e) => {
		var t = Ch(), n = N(t), i = P(n, !0), a = F(n, 2), o = P(a, !0);
		ah(F(a, 2), {
			get code() {
				return z(r).content;
			},
			get language() {
				return z(r).language;
			}
		}), I(() => {
			W(i, z(r).path), W(o, z(r).label);
		}), U(e, t);
	}, g = (e) => {
		var t = wh(), n = P(t, !0);
		I(() => W(n, z(r).label)), U(e, t);
	};
	G(f, (e) => {
		z(r).kind === "bash" ? e(p) : z(r).kind === "edit" ? e(m, 1) : z(r).kind === "write" ? e(h, 2) : e(g, -1);
	}), gh(F(f, 2), () => z(r).rest), T(d);
	var _ = F(d, 2), v = (e) => {
		var n = Eh(), r = N(n), a = P(r, !0), o = F(r, 2), s = (e) => {
			ah(e, {
				get code() {
					return z(i).code;
				},
				get language() {
					return z(i).language;
				}
			});
		}, c = (e) => {
			var t = Th(), n = P(t, !0);
			I(() => W(n, z(i).text)), U(e, t);
		};
		G(o, (e) => {
			z(i).kind === "code" ? e(s) : e(c, -1);
		}), I((e) => W(a, e), [() => xm(t.entry)]), U(e, n);
	};
	G(_, (e) => {
		z(i) && e(v);
	}), T(a), I((e) => {
		W(c, t.entry.tool), W(l, `${z(n) ?? ""} `), W(u, e);
	}, [() => Z(t.entry.timestamp)]), U(e, a), D();
}
//#endregion
//#region src/components/ChatUsage.svelte
var kh = /* @__PURE__ */ V([" ", [
	"span",
	{ role: "note" },
	" "
]], 1), Ah = /* @__PURE__ */ V([" ", [
	"span",
	{
		class: "rebuild-chip",
		role: "note"
	},
	" "
]], 1), jh = /* @__PURE__ */ V([[
	"div",
	{ role: "note" },
	[
		"strong",
		null,
		" "
	],
	" "
]]), Mh = /* @__PURE__ */ V([
	[
		"div",
		null,
		[
			"strong",
			null,
			" "
		],
		[
			"span",
			null,
			" "
		],
		,
		,
	],
	" ",
	,
], 1);
function Nh(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => t.hint && Nm(t.hint) ? Fm(t.hint) : null), r = /* @__PURE__ */ O(() => t.usage.rebuild ? Im(t.usage.rebuild) : null), i = /* @__PURE__ */ O(() => Lm(t.hint));
	var a = Mh(), o = N(a), s = M(o), c = P(s, !0), l = F(s), u = P(l, !0), d = F(l), f = (e) => {
		var t = kh(), r = N(t, !0);
		r.nodeValue = " ";
		var i = F(r), a = P(i, !0);
		I(() => {
			fi(i, 1, oi(["compact-chip", z(n).tone])), W(a, z(n).text);
		}), U(e, t);
	};
	G(d, (e) => {
		z(n) && e(f);
	});
	var p = F(d), m = (e) => {
		var t = Ah(), n = N(t, !0);
		n.nodeValue = " ";
		var i = F(n), a = P(i, !0);
		I(() => {
			q(i, "title", z(r).title), W(a, z(r).text);
		}), U(e, t);
	};
	G(p, (e) => {
		z(r) && e(m);
	}), T(o);
	var h = F(o, 2), g = (e) => {
		var t = jh(), n = M(t), r = P(n, !0), a = F(n);
		T(t), I(() => {
			fi(t, 1, oi(["compact-hint", z(i).tone])), W(r, z(i).label), W(a, ` ${z(i).text ?? ""}`);
		}), U(e, t);
	};
	G(h, (e) => {
		z(i) && e(g);
	}), I((e, t, n, r) => {
		fi(o, 1, e), q(o, "title", t), W(c, n), W(u, r);
	}, [
		() => oi(["chat-usage", Pm(t.hint)]),
		() => Mm(t.usage) ?? void 0,
		() => jm(t.usage),
		() => ` · ${Am(t.usage).join(" · ")}`
	]), U(e, a), D();
}
//#endregion
//#region src/components/ConversationEntry.svelte
var Ph = /* @__PURE__ */ V([
	,
	,
	" ",
	,
], 1);
function Fh(e, t) {
	E(t, !0);
	var n = Ph(), r = N(n), i = (e) => {
		Um(e, { get entry() {
			return t.entry;
		} });
	}, a = (e) => {
		Bm(e, { get entry() {
			return t.entry;
		} });
	}, o = (e) => {
		Oh(e, { get entry() {
			return t.entry;
		} });
	}, s = (e) => {
		hh(e, { get entry() {
			return t.entry;
		} });
	};
	G(r, (e) => {
		t.entry.kind === "compaction" || t.entry.kind === "error" ? e(i) : t.entry.kind === "injected" ? e(a, 1) : t.entry.kind === "tool" ? e(o, 2) : e(s, -1);
	});
	var c = F(r, 2), l = (e) => {
		Nh(e, {
			get usage() {
				return t.entry.usage;
			},
			get hint() {
				return t.entry.compact_hint;
			}
		});
	};
	G(c, (e) => {
		t.entry.usage && e(l);
	}), U(e, n), D();
}
//#endregion
//#region src/components/Conversation.svelte
var Ih = /* @__PURE__ */ V([[
	"option",
	null,
	" "
]]), Lh = /* @__PURE__ */ V([["optgroup"]]), Rh = /* @__PURE__ */ V([[
	"option",
	null,
	" "
]]), zh = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), Bh = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]), Vh = /* @__PURE__ */ V([[
	"div",
	{ class: "chat-reminders muted" },
	" "
]]), Hh = /* @__PURE__ */ V([[
	"div",
	{ class: "chat-row" },
	,
]]), Uh = /* @__PURE__ */ V([
	[
		"button",
		{
			type: "button",
			class: "skip-link"
		},
		"Skip the conversation"
	],
	" ",
	,
	" ",
	["div", { class: "chat" }]
], 1), Wh = /* @__PURE__ */ V([
	[
		"section",
		{
			class: "chat-section",
			id: "chat-section",
			"aria-labelledby": "chat-heading"
		},
		[
			"div",
			{ class: "chart-head chat-section-head" },
			[
				"h3",
				{ id: "chat-heading" },
				" "
			],
			" ",
			[
				"span",
				{ class: "muted" },
				"read from the transcript when you ask, never stored"
			],
			" ",
			["span", { class: "spacer" }],
			" ",
			["select", {
				id: "chat-agent",
				"aria-label": "Conversation of"
			}],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-order",
					"aria-label": "Oldest first"
				},
				[
					"span",
					{
						class: "chat-order-arrow",
						"aria-hidden": "true"
					},
					"↓"
				]
			],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-load"
				},
				" "
			],
			" ",
			[
				"button",
				{
					type: "button",
					id: "chat-close"
				},
				"Close"
			]
		],
		" ",
		[
			"div",
			{ id: "chat" },
			,
		]
	],
	" ",
	["div", {
		id: "chat-end",
		class: "chat-end",
		tabindex: "-1",
		role: "note",
		"aria-label": "End of the conversation"
	}]
], 1);
function Gh(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ A(""), r = /* @__PURE__ */ A(!1), i = /* @__PURE__ */ A(null), a = /* @__PURE__ */ A(null), o = /* @__PURE__ */ A(void 0), s = /* @__PURE__ */ A(void 0), c = /* @__PURE__ */ A(void 0), l = 0, u = /* @__PURE__ */ O(() => Xp(Q.session?.agents ?? [])), d = /* @__PURE__ */ O(() => z(i) ? Qp(z(i)) : null), f = /* @__PURE__ */ O(() => z(i) ? Zp(z(i).reminders) : null), p = /* @__PURE__ */ new WeakMap(), m = /* @__PURE__ */ O(() => z(i) ? $o(z(i).entries, gs.oldestFirst).map((e) => {
		let t = p.get(e.entry);
		return t?.key === e.key ? t : (p.set(e.entry, e), e);
	}) : []);
	async function h() {
		let e = Q.session;
		if (!e) return;
		let t = ++l;
		j(i, null), j(a, "Loading…");
		try {
			let r = await tm(qp(e.session_id, z(n) || null));
			if (t !== l) return;
			j(i, r), j(a, null);
		} catch (e) {
			t === l && j(a, e instanceof Error ? e.message : String(e), !0);
		}
	}
	function g() {
		j(r, !0), h();
	}
	function _(e) {
		j(n, e.currentTarget.value, !0), z(r) && h();
	}
	function v() {
		l++, j(i, null), j(a, null), j(r, !1), z(o)?.focus();
	}
	async function y() {
		let e = Q.session;
		if (!z(r) || !z(i) || !e) return;
		let t = ++l, a;
		try {
			a = await tm(qp(e.session_id, z(n) || null));
		} catch {
			return;
		}
		if (t !== l || !z(i) || $p(z(i), a)) return;
		let o = z(s) && z(s).getBoundingClientRect().top < 0 ? ks(z(s).querySelectorAll("[data-key]")) : null;
		j(i, em(z(i), a)), await gr(), As(o, o?.node);
	}
	Tn(() => {
		Q.session, yr(() => {
			y();
		});
	}), Tn(() => () => {
		l++;
	});
	var ee = Wh(), b = N(ee), x = M(b), S = M(x), te = P(S, !0), ne = F(S, 6);
	K(ne, 21, () => z(u), (e) => "group" in e ? `group ${e.group}` : `option ${e.value}`, (e, t) => {
		var n = H(), r = N(n), i = (e) => {
			var n = Lh();
			K(n, 21, () => z(t).options, (e) => e.value, (e, t) => {
				var n = Ih(), r = P(n, !0), i = {};
				I(() => {
					W(r, z(t).label), i !== (i = z(t).value) && (n.value = (n.__value = i) ?? "");
				}), U(e, n);
			}), T(n), I(() => q(n, "label", z(t).group)), U(e, n);
		}, a = (e) => {
			var n = Rh(), r = P(n, !0), i = {};
			I(() => {
				W(r, z(t).label), i !== (i = z(t).value) && (n.value = (n.__value = i) ?? "");
			}), U(e, n);
		};
		G(r, (e) => {
			"group" in z(t) ? e(i) : e(a, -1);
		}), U(e, n);
	}), T(ne), vi(ne);
	var re = F(ne, 2), ie = F(re, 2), ae = P(ie, !0);
	Li(ie, (e) => j(o, e), () => z(o));
	var oe = F(ie, 2);
	T(x);
	var se = F(x, 2), ce = M(se), le = (e) => {
		var t = zh(), n = P(t, !0);
		I(() => W(n, z(a))), U(e, t);
	}, ue = (e) => {
		var t = Bh(), n = P(t, !0);
		I(() => W(n, z(d))), U(e, t);
	}, de = (e) => {
		var t = Uh(), n = N(t), r = F(n, 2), i = (e) => {
			var t = Vh(), n = P(t, !0);
			I(() => W(n, z(f))), U(e, t);
		};
		G(r, (e) => {
			z(f) !== null && e(i);
		});
		var a = F(r, 2);
		K(a, 21, () => z(m), (e) => e.key, (e, t) => {
			var n = Hh();
			Fh(M(n), { get entry() {
				return z(t).entry;
			} }), T(n), I(() => q(n, "data-key", z(t).key)), U(e, n);
		}), T(a), B("click", n, () => z(c)?.focus()), U(e, t);
	};
	G(ce, (e) => {
		z(a) === null ? z(d) === null ? z(i) && e(de, 2) : e(ue, 1) : e(le);
	}), T(se), Li(se, (e) => j(s, e), () => z(s)), T(b), Li(F(b, 2), (e) => j(c, e), () => z(c)), I((e, t) => {
		W(te, e), q(re, "aria-pressed", gs.oldestFirst), q(re, "title", t), W(ae, z(i) ? "Reload" : "Show conversation"), q(oe, "hidden", !z(r));
	}, [() => $("Conversation"), () => Jp(gs.oldestFirst)]), B("change", ne, _), yi(ne, () => z(n), (e) => j(n, e)), B("click", re, () => gs.oldestFirst = !gs.oldestFirst), B("click", ie, g), B("click", oe, v), U(e, ee), D();
}
Tr(["change", "click"]);
//#endregion
//#region src/components/InputSplit.svelte
var Kh = /* @__PURE__ */ V([["span"]]), qh = /* @__PURE__ */ V([[
	"div",
	{ class: "split-row" },
	,
	" ",
	[
		"span",
		null,
		" "
	],
	" ",
	[
		"strong",
		{ class: "split-number" },
		" "
	],
	" ",
	[
		"span",
		{ class: "split-number secondary" },
		" "
	],
	" ",
	[
		"span",
		{ class: "split-number" },
		" "
	]
]]), Jh = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), Yh = /* @__PURE__ */ V([[
	"div",
	{ class: "card" },
	[
		"div",
		{ class: "label" },
		" "
	],
	" ",
	[
		"div",
		{ class: "tile-value" },
		" "
	],
	" ",
	["div", {
		class: "split",
		role: "img"
	}],
	" ",
	,
	" ",
	,
]]);
function Xh(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => Pa(t.totals)), r = /* @__PURE__ */ O(() => Id(t.totals)), i = /* @__PURE__ */ O(() => Rd(t.context, t.hintTokens));
	var a = Yh(), o = M(a), s = P(o, !0), c = F(o, 2), l = P(c, !0), u = F(c, 2);
	K(u, 21, () => z(r).filter((e) => e.tokens > 0), (e) => e.label, (e, t) => {
		var n = Kh();
		let r;
		I(() => r = mi(n, "", r, {
			"flex-grow": z(t).tokens,
			background: z(t).color
		})), U(e, n);
	}), T(u);
	var d = F(u, 2);
	K(d, 17, () => z(r), (e) => e.label, (e, t) => {
		var r = qh(), i = M(r);
		Ds(i, { get fill() {
			return z(t).color;
		} });
		var a = F(i, 2), o = P(a, !0), s = F(a, 2), c = P(s, !0), l = F(s, 2), u = P(l, !0), d = P(F(l, 2), !0);
		T(r), I((e, n, i, a) => {
			q(r, "title", z(t).note), W(o, e), W(c, n), W(u, i), W(d, a);
		}, [
			() => $(z(t).label),
			() => J(z(t).tokens),
			() => Ca(z(t).tokens, z(n)),
			() => X(z(t).cost)
		]), U(e, r);
	});
	var f = F(d, 2), p = (e) => {
		var t = Jh();
		q(t, "title", "The context a main-thread turn reads: new input, cache writes and reads. The conversation hints at compacting from the threshold on ([chat] compact_hint_tokens).");
		var n = P(t, !0);
		I(() => W(n, z(i))), U(e, t);
	};
	G(f, (e) => {
		z(i) !== null && e(p);
	}), T(a), I((e, t, n) => {
		W(s, e), W(l, t), q(u, "aria-label", n);
	}, [
		() => $("Input tokens"),
		() => J(z(n)),
		() => Ld(z(r), t.totals)
	]), U(e, a), D();
}
//#endregion
//#region src/components/KpiTiles.svelte
var Zh = /* @__PURE__ */ V([
	[
		"div",
		null,
		" "
	],
	" ",
	[
		"div",
		null,
		" "
	]
], 1), Qh = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	,
]]), $h = /* @__PURE__ */ V([
	[
		"div",
		{ class: "card" },
		[
			"div",
			{ class: "label" },
			[
				"span",
				null,
				" "
			],
			" "
		],
		" ",
		[
			"div",
			{ class: "hero" },
			" "
		],
		" ",
		[
			"div",
			{ class: "note" },
			" "
		],
		" ",
		,
	],
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function eg(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => t.savings ? Fd(t.savings) : null);
	var r = $h(), i = N(r), a = M(i), o = M(a), s = P(o, !0), c = F(o);
	T(a);
	var l = F(a, 2), u = P(l, !0), d = F(l, 2), f = P(d, !0), p = F(d, 2), m = (e) => {
		var t = Qh(), r = M(t), i = (e) => {
			var t = Zh(), r = N(t), i = P(r, !0), a = P(F(r, 2), !0);
			I(() => {
				fi(r, 1, oi(z(n).verdict === "gain" ? "verdict-gain" : "verdict-loss")), W(i, z(n).amount), W(a, z(n).count);
			}), U(e, t);
		}, a = (e) => {
			var t = Mr();
			I(() => W(t, z(n).count)), U(e, t);
		};
		G(r, (e) => {
			z(n).verdict ? e(i) : e(a, -1);
		}), T(t), I(() => q(t, "title", z(n).title)), U(e, t);
	};
	G(p, (e) => {
		z(n) && e(m);
	}), T(i);
	var h = F(i, 2);
	Xh(h, {
		get totals() {
			return t.totals;
		},
		get context() {
			return t.context;
		},
		get hintTokens() {
			return t.hintTokens;
		}
	});
	var g = F(h, 2);
	{
		let e = /* @__PURE__ */ O(() => Y(t.totals.turns));
		Cp(g, {
			label: "Turns",
			get value() {
				return z(e);
			},
			note: "API calls with usage",
			themedNote: !0
		});
	}
	var _ = F(g, 2);
	{
		let e = /* @__PURE__ */ O(() => J(t.totals.output)), n = /* @__PURE__ */ O(() => X(t.totals.cost_parts.output));
		Cp(_, {
			label: "Output tokens",
			get value() {
				return z(e);
			},
			get note() {
				return z(n);
			}
		});
	}
	I((e, n, r) => {
		W(s, e), W(c, `, ${t.scope ?? ""}`), W(u, n), W(f, r);
	}, [
		() => $("Estimated cost"),
		() => X(t.totals.cost),
		() => Nd(t.totals)
	]), U(e, r), D();
}
//#endregion
//#region src/components/RuntimeTiles.svelte
var tg = /* @__PURE__ */ V([
	,
	,
	" ",
	,
	" ",
	,
	" ",
	,
], 1);
function ng(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => "source" in t.runtime && t.runtime.source === "transcripts"), r = /* @__PURE__ */ O(() => zd(t.runtime, t.from, t.costPer100Lines, z(n)));
	var i = tg(), a = N(i);
	{
		let e = /* @__PURE__ */ O(() => wa(t.runtime.duration_ms));
		Cp(a, {
			label: "Session time",
			get value() {
				return z(e);
			},
			get note() {
				return z(r).session;
			}
		});
	}
	var o = F(a, 2);
	{
		let e = /* @__PURE__ */ O(() => wa(t.runtime.api_ms));
		Cp(o, {
			label: "Waiting on the API",
			get value() {
				return z(e);
			},
			get note() {
				return z(r).api;
			}
		});
	}
	var s = F(o, 2);
	{
		let e = /* @__PURE__ */ O(() => wa(t.runtime.tool_ms));
		Cp(s, {
			label: "Running tools",
			get value() {
				return z(e);
			},
			get note() {
				return z(r).tools;
			}
		});
	}
	var c = F(s, 2);
	{
		let e = /* @__PURE__ */ O(() => `+${Y(t.runtime.lines_added)} / −${Y(t.runtime.lines_removed)}`);
		Cp(c, {
			label: "Lines changed",
			get value() {
				return z(e);
			},
			get note() {
				return z(r).lines;
			}
		});
	}
	U(e, i), D();
}
//#endregion
//#region src/lib/secrets.ts
function rg(e) {
	let t = (e.secret_accesses ?? []).map((e) => e.severity);
	return t.length ? t.includes("high") ? "alert" : t.includes("medium") ? "warning" : "quiet" : null;
}
function ig(e) {
	return e.via ? `in ${e.via}, which it ran` : null;
}
var ag = {
	sent: "sent to a service",
	returned: "into the conversation",
	empty: "nothing returned",
	pending: "no result yet"
};
function og(e) {
	return e.reach === "error" ? e.sent ? "error, the service may have got it" : "error: blocked or failed" : e.reach === "returned" && e.test ? "into the conversation, likely a test" : Object.hasOwn(ag, e.reach) ? ag[e.reach] ?? "" : "no result yet";
}
var sg = [
	{ label: "Time" },
	{ label: "Agent" },
	{ label: "Tool" },
	{ label: "Path" },
	{
		label: "Matched",
		title: "the [secrets] pattern it matched"
	},
	{ label: "Reached" }
];
function cg(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e) => {
		let n = [
			e.time,
			e.agent_id,
			e.tool,
			e.path,
			e.pattern
		].join("\0"), r = t.get(n) ?? 0;
		return t.set(n, r + 1), {
			key: r ? `${n}\u0000${r}` : n,
			time: Z(e.time),
			agent: e.agent_type,
			tool: e.tool,
			path: e.path,
			via: ig(e),
			pattern: e.pattern,
			severity: e.severity || "medium",
			reach: og(e)
		};
	});
}
function lg(e) {
	return e.length === 1 ? "1 call" : `${Y(e.length)} calls`;
}
function ug(e, t) {
	return e.filter((e) => e.severity === t).length;
}
function dg(e) {
	return `Possible secret access: ${lg(e)} (${Y(ug(e, "high"))} sent out)`;
}
function fg(e, t) {
	let n = `${lg(e)} named a possible secret location`;
	if (t === "warning") return `${n}, ${Y(ug(e, "medium"))} of them returned a result or may still`;
	let r = ug(e, "low-medium");
	return r ? `${n}, ${Y(r)} returned a result only in a likely test` : `${n}, none reached anything`;
}
//#endregion
//#region src/components/SecretAccesses.svelte
var pg = (e, t = v) => {
	var n = gg(), r = N(n), i = P(r, !0), a = F(r, 2), o = P(a, !0), s = F(a, 2), c = P(s, !0), l = F(s, 2), u = M(l), d = P(u, !0), f = F(u), p = (e) => {
		var n = hg(), r = P(n, !0);
		I(() => W(r, t().via)), U(e, n);
	};
	G(f, (e) => {
		t().via && e(p);
	}), T(l);
	var m = F(l, 2), h = P(m, !0), g = F(m, 2), _ = M(g), y = F(_, 1, !0);
	T(g), I(() => {
		W(i, t().time), W(o, t().agent), W(c, t().tool), W(d, t().path), W(h, t().pattern), fi(_, 1, `secret-severity secret-severity-${t().severity ?? ""}`), W(y, t().reach);
	}), U(e, n);
}, mg = /* @__PURE__ */ V([[
	"div",
	null,
	[
		"p",
		null,
		"These tool calls named a path that matches a possible secret location. Most severe first: sent to an MCP server or\n      a network program, then returned into the conversation (and so to the API), then blocked, failed or empty. Check\n      that each was meant."
	],
	" ",
	,
	" ",
	[
		"p",
		{ class: "muted" },
		"Matched against [secrets] patterns in the config: file tools by their path, commands by their words with the\n      variables they set (quoted text only where it holds a path), and scripts this transcript wrote and then ran by\n      their text. Variables from earlier calls and other scripts are unknown. A result counts whatever it held: a test\n      that only mentions a path returns output too."
	]
]]), hg = /* @__PURE__ */ V([[
	"span",
	{ class: "secret-via" },
	" "
]]), gg = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"span",
			{ class: "secret-path" },
			" "
		],
		,
	],
	" ",
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		["span", { "aria-hidden": "true" }],
		" "
	]
], 1), _g = /* @__PURE__ */ V([[
	"div",
	{
		id: "secret-alert",
		class: "card secret-alert",
		role: "region",
		"aria-labelledby": "secret-alert-title"
	},
	[
		"h3",
		{
			class: "secret-alert-head",
			id: "secret-alert-title"
		},
		[
			"span",
			{
				class: "secret-alert-icon",
				"aria-hidden": "true"
			},
			"!"
		],
		" "
	],
	" ",
	,
]]), vg = /* @__PURE__ */ V([[
	"div",
	{
		id: "secret-alert",
		role: "region",
		"aria-labelledby": "secret-alert-title"
	},
	[
		"div",
		{ class: "secret-folded-line" },
		[
			"h3",
			{
				class: "secret-folded-head",
				id: "secret-alert-title"
			},
			" "
		],
		" ",
		[
			"button",
			{
				type: "button",
				class: "link-button"
			},
			" "
		]
	],
	" ",
	,
]]);
function yg(e, t) {
	E(t, !0);
	let n = (e, t = v, n = v) => {
		var r = mg(), i = F(M(r), 2);
		{
			let e = /* @__PURE__ */ O(() => `${t()}-secrets`);
			qs(i, {
				get key() {
					return z(e);
				},
				get columns() {
					return sg;
				},
				get rows() {
					return z(s);
				},
				rowKey: (e) => e.key,
				get cells() {
					return pg;
				},
				labelledby: "secret-alert-title"
			});
		}
		je(2), T(r), I(() => q(r, "hidden", n())), U(e, r);
	}, r = /* @__PURE__ */ O(() => Q.session), i = /* @__PURE__ */ O(() => z(r)?.secret_accesses ?? []), a = /* @__PURE__ */ O(() => z(r) ? rg(z(r)) : null), o = /* @__PURE__ */ O(() => z(a) === "warning" || z(a) === "quiet" ? z(a) : null), s = /* @__PURE__ */ O(() => cg(z(i))), c = /* @__PURE__ */ A(!1);
	var l = H(), u = N(l), d = (e) => {
		var t = _g(), a = M(t), o = F(M(a), 1, !0);
		T(a);
		var s = F(a, 2);
		n(s, () => z(r).session_id, () => !1), T(t), I((e) => W(o, e), [() => dg(z(i))]), U(e, t);
	}, f = (e) => {
		var t = vg(), a = M(t), s = M(a), l = P(s, !0), u = F(s, 2), d = P(u, !0);
		T(a);
		var f = F(a, 2);
		n(f, () => z(r).session_id, () => !z(c)), T(t), I((e) => {
			fi(t, 1, oi([
				"card",
				"secret-folded",
				z(o) === "warning" && "secret-warning"
			])), W(l, e), q(u, "aria-expanded", z(c)), W(d, z(c) ? "Hide them" : "Show them");
		}, [() => fg(z(i), z(o))]), B("click", u, () => j(c, !z(c))), U(e, t);
	};
	G(u, (e) => {
		z(r) && z(a) === "alert" ? e(d) : z(r) && z(o) && e(f, 1);
	}), U(e, l), D();
}
Tr(["click"]);
//#endregion
//#region src/components/SessionWaits.svelte
var bg = /* @__PURE__ */ V([[
	"strong",
	null,
	" "
]]), xg = /* @__PURE__ */ V([[
	"span",
	null,
	[
		"a",
		null,
		" "
	],
	" "
]]), Sg = /* @__PURE__ */ V([[
	"p",
	{ class: "wait-line" },
	[
		"span",
		{ class: "wait-icon" },
		,
	],
	" ",
	,
]]), Cg = /* @__PURE__ */ V([["div", {
	class: "card wait-notice",
	role: "status"
}]]);
function wg(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => Q.session), r = /* @__PURE__ */ O(() => z(n) ? fl(z(n), Q.live?.sessions ?? []) : []);
	var i = Cg();
	K(i, 21, () => z(r), (e) => e.session_id, (e, t) => {
		var n = Sg(), r = M(n);
		yl(M(r), { get badge() {
			return z(t);
		} }), T(r);
		var i = F(r, 2), a = (e) => {
			var n = bg(), r = P(n);
			I((e, t) => W(r, `This session is ${e ?? ""}${t ?? ""}`), [() => z(t).text.charAt(0).toLowerCase(), () => z(t).text.slice(1)]), U(e, n);
		}, o = (e) => {
			var n = xg(), r = M(n), i = P(r, !0), a = F(r);
			T(n), I((e) => {
				q(r, "href", e), W(i, z(t).title), W(a, `: ${z(t).text ?? ""}`);
			}, [() => Sc(z(t))]), U(e, n);
		};
		G(i, (e) => {
			z(t).title === null ? e(a) : e(o, -1);
		}), T(n), U(e, n);
	}), T(i), I(() => q(i, "hidden", z(r).length === 0)), U(e, i), D();
}
//#endregion
//#region src/components/ToolsTable.svelte
var Tg = (e) => {
	U(e, Eg());
}, Eg = /* @__PURE__ */ V([[
	"h3",
	{ id: "session-tools-title" },
	"Tools"
]]), Dg = /* @__PURE__ */ V([[
	"div",
	{ class: "note" },
	" "
]]), Og = /* @__PURE__ */ V([[
	"button",
	{
		type: "button",
		class: "link-button"
	},
	" "
], ")"], 1), kg = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Ag = /* @__PURE__ */ V([
	[
		"td",
		null,
		" "
	],
	" ",
	[
		"td",
		null,
		[
			"span",
			null,
			" ",
			,
		]
	],
	" ",
	,
], 1);
function jg(e, t) {
	E(t, !0);
	let n = (e) => {
		var t = Dg(), n = P(t, !0);
		I(() => W(n, z(s))), U(e, t);
	}, r = (e, t = v) => {
		var n = Ag(), r = N(n), i = P(r, !0), a = F(r, 2), o = M(a), s = M(o, !0), l = F(s), u = (e) => {
			let n = /* @__PURE__ */ O(() => t().fold);
			var r = Og(), i = N(r), a = P(i, !0);
			je(), I(() => {
				q(i, "aria-expanded", z(n).open), W(a, z(n).label);
			}), B("click", i, () => c(z(n).fold)), U(e, r);
		};
		G(l, (e) => {
			t().fold && e(u);
		}), T(o), T(a), K(F(a, 2), 17, () => t().cells, Jr, (e, t) => {
			var n = kg(), r = P(n, !0);
			I(() => W(r, z(t))), U(e, n);
		}), I(() => {
			W(i, t().agent), fi(o, 1, oi(t().name.className)), W(s, t().fold ? `${t().name.text} (` : t().name.text);
		}), U(e, n);
	}, i = /* @__PURE__ */ A(Qt([])), a = kd(), o = /* @__PURE__ */ O(() => jd(t.agents, z(i))), s = /* @__PURE__ */ O(() => Ad(t.agents));
	function c(e) {
		j(i, z(i).includes(e) ? z(i).filter((t) => t !== e) : [...z(i), e], !0);
	}
	{
		let i = /* @__PURE__ */ O(() => z(s) === null ? void 0 : n);
		qs(e, {
			get key() {
				return t.pagerKey;
			},
			get columns() {
				return a;
			},
			get rows() {
				return z(o);
			},
			rowKey: (e) => e.key,
			get cells() {
				return r;
			},
			sub: (e) => e.sub,
			group: (e) => e.group,
			get heading() {
				return Tg;
			},
			get intro() {
				return z(i);
			},
			empty: "No tool calls.",
			labelledby: "session-tools-title"
		});
	}
	D();
}
Tr(["click"]);
//#endregion
//#region src/components/UsageTable.svelte
var Mg = /* @__PURE__ */ V([[
	"h3",
	null,
	" "
]]), Ng = /* @__PURE__ */ V([[
	"h2",
	null,
	" "
]]), Pg = /* @__PURE__ */ V([[
	"p",
	{ class: "note" },
	" "
]]), Fg = /* @__PURE__ */ V([[
	"span",
	null,
	,
	" "
]]), Ig = /* @__PURE__ */ V([[
	"span",
	{ class: "effort" },
	" "
]]), Lg = /* @__PURE__ */ V([[
	"td",
	{ class: "num" },
	" "
]]), Rg = /* @__PURE__ */ V([
	[
		"td",
		null,
		,
	],
	" ",
	,
], 1), zg = /* @__PURE__ */ V([[
	"section",
	{ class: "card" },
	,
]]);
function Bg(e, t) {
	E(t, !0);
	let n = (e) => {
		var n = H(), o = N(n), c = (e) => {
			{
				let n = /* @__PURE__ */ O(() => Ud(t.nameLabel)), o = /* @__PURE__ */ O(() => t.note === void 0 ? void 0 : i);
				qs(e, {
					get key() {
						return s();
					},
					get columns() {
						return z(n);
					},
					get rows() {
						return t.rows;
					},
					rowKey: (e) => e.key,
					get cells() {
						return a;
					},
					sub: (e) => e.sub,
					group: (e) => e.group,
					get heading() {
						return r;
					},
					get intro() {
						return z(o);
					},
					get empty() {
						return t.empty;
					},
					get labelledby() {
						return `${t.id ?? ""}-title`;
					}
				});
			}
		}, l = (e) => {
			r(e);
		};
		G(o, (e) => {
			t.rows ? e(c) : e(l, -1);
		}), U(e, n);
	}, r = (e) => {
		var n = H(), r = N(n), i = (e) => {
			var n = Mg(), r = P(n, !0);
			I(() => {
				q(n, "id", `${t.id ?? ""}-title`), W(r, t.title);
			}), U(e, n);
		}, a = (e) => {
			var n = Ng(), r = P(n, !0);
			I(() => {
				q(n, "id", `${t.id ?? ""}-title`), W(r, t.title);
			}), U(e, n);
		};
		G(r, (e) => {
			o() ? e(i) : e(a, -1);
		}), U(e, n);
	}, i = (e) => {
		var n = Pg(), r = P(n, !0);
		I(() => W(r, t.note)), U(e, n);
	}, a = (e, t = v) => {
		var n = Rg(), r = N(n), i = M(r), a = (e) => {
			var n = Fg(), r = M(n);
			Ds(r, { get fill() {
				return t().swatch;
			} });
			var i = F(r, 1, !0);
			T(n), I(() => W(i, t().name)), U(e, n);
		}, o = (e) => {
			var n = Ig(), r = P(n, !0);
			I(() => W(r, t().name)), U(e, n);
		}, s = (e) => {
			var n = Mr();
			I(() => W(n, t().name)), U(e, n);
		};
		G(i, (e) => {
			t().kind === "model" ? e(a) : t().kind === "effort" ? e(o, 1) : e(s, -1);
		}), T(r), K(F(r, 2), 19, () => z(c), (e) => e.label, (e, n, r) => {
			var i = Lg(), a = P(i, !0);
			I(() => W(a, t().cells[z(r)])), U(e, i);
		}), U(e, n);
	}, o = Bi(t, "inline", 3, !1), s = Bi(t, "pagerKey", 19, () => t.id), c = /* @__PURE__ */ O(() => Ud(t.nameLabel).slice(1));
	var l = H(), u = N(l), d = (e) => {
		n(e);
	}, f = (e) => {
		var r = zg(), i = M(r);
		n(i), T(r), I(() => q(r, "aria-labelledby", `${t.id ?? ""}-title`)), U(e, r);
	};
	G(u, (e) => {
		o() ? e(d) : e(f, -1);
	}), U(e, l), D();
}
//#endregion
//#region src/components/SessionView.svelte
var Vg = /* @__PURE__ */ V([[
	"div",
	{ class: "prompt" },
	" "
]]), Hg = /* @__PURE__ */ V([[
	"div",
	{
		class: "kpis session-kpis",
		role: "group",
		"aria-label": "Time and lines changed"
	},
	,
]]), Ug = /* @__PURE__ */ V([[
	"section",
	{
		id: "drilldown",
		class: "card",
		"aria-labelledby": "drilldown-title"
	},
	[
		"div",
		{ class: "chart-head" },
		[
			"h2",
			{
				id: "drilldown-title",
				tabindex: "-1"
			},
			" "
		],
		" ",
		["span", { class: "spacer" }],
		"  ",
		[
			"a",
			{
				href: "#",
				"aria-keyshortcuts": "Escape"
			},
			"Close"
		]
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "muted" },
		" "
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "kpis session-kpis" },
		,
	],
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	,
	" ",
	[
		"div",
		{ class: "grid-2" },
		[
			"div",
			null,
			,
		],
		" ",
		[
			"div",
			null,
			,
		]
	],
	" ",
	,
	" ",
	,
	" ",
	,
]]);
function Wg(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => Q.session), r = /* @__PURE__ */ O(() => z(n) ? Gd(z(n).models, z(n).model_effort, $i(z(n).models.map((e) => e.model))) : []), i = /* @__PURE__ */ O(() => z(n) ? Wd(z(n).skills, (e) => e.skill) : []), a = /* @__PURE__ */ O(() => z(n) ? Wd(z(n).mcp_servers, (e) => e.mcp_server) : []), o = /* @__PURE__ */ O(() => z(n) ? Fu(z(n).api_errors) : []);
	function s(e) {
		z(n) && e.key === "Escape" && !e.defaultPrevented && (location.hash = "");
	}
	var c = H();
	wr("keydown", nn, s);
	var l = N(c), u = (e) => {
		let t = /* @__PURE__ */ O(() => z(n).session_id), s = /* @__PURE__ */ O(() => z(n).runtime);
		var c = H();
		qr(N(c), () => z(t), (e) => {
			var c = Ug(), l = M(c), u = P(M(l), !0);
			je(4), T(l);
			var d = F(l, 2), f = (e) => {
				var t = Vg(), r = P(t, !0);
				I(() => W(r, z(n).prompt)), U(e, t);
			};
			G(d, (e) => {
				z(n).prompt && e(f);
			});
			var p = F(d, 2), m = P(p, !0), h = F(p, 2);
			wg(h, {});
			var g = F(h, 2);
			eg(M(g), {
				get totals() {
					return z(n);
				},
				scope: "this session",
				get context() {
					return z(n).context;
				},
				get hintTokens() {
					return z(n).compact_hint_tokens;
				},
				get savings() {
					return z(n).compaction_savings;
				}
			}), T(g);
			var _ = F(g, 2), v = (e) => {
				var t = Hg(), r = M(t);
				{
					let e = /* @__PURE__ */ O(() => Vd(z(s).source)), t = /* @__PURE__ */ O(() => Hd({
						cost: z(n).cost,
						runtime: z(s)
					}));
					ng(r, {
						get runtime() {
							return z(s);
						},
						get from() {
							return z(e);
						},
						get costPer100Lines() {
							return z(t);
						}
					});
				}
				T(t), U(e, t);
			};
			G(_, (e) => {
				z(s) && e(v);
			});
			var y = F(_, 2);
			yg(y, {});
			var ee = F(y, 2);
			Ef(ee, {});
			var b = F(ee, 2);
			Kp(b, {});
			var x = F(b, 2);
			{
				let e = /* @__PURE__ */ O(() => $("By model"));
				Bg(x, {
					inline: !0,
					id: "session-models",
					get title() {
						return z(e);
					},
					nameLabel: "Model",
					get rows() {
						return z(r);
					},
					empty: "No usage in this range.",
					get pagerKey() {
						return `${z(t) ?? ""}-models`;
					}
				});
			}
			var S = F(x, 2);
			$d(S, {
				get agents() {
					return z(n).agents;
				},
				get pagerKey() {
					return `${z(t) ?? ""}-agents`;
				}
			});
			var te = F(S, 2), ne = (e) => {
				jg(e, {
					get agents() {
						return z(n).agents;
					},
					get pagerKey() {
						return `${z(t) ?? ""}-tools`;
					}
				});
			};
			G(te, (e) => {
				z(n).transcript || e(ne);
			});
			var re = F(te, 2), ie = (e) => {
				Gh(e, {});
			};
			G(re, (e) => {
				z(n).transcript && e(ie);
			});
			var ae = F(re, 2), oe = M(ae), se = M(oe);
			{
				let e = /* @__PURE__ */ O(() => $("By skill"));
				Bg(se, {
					inline: !0,
					id: "session-skills",
					get title() {
						return z(e);
					},
					nameLabel: "Skill",
					get rows() {
						return z(i);
					},
					empty: "No turns attributed to a skill.",
					get pagerKey() {
						return `${z(t) ?? ""}-skills`;
					}
				});
			}
			T(oe);
			var ce = F(oe, 2), le = M(ce);
			{
				let e = /* @__PURE__ */ O(() => $("By MCP server"));
				Bg(le, {
					inline: !0,
					id: "session-mcp-servers",
					get title() {
						return z(e);
					},
					nameLabel: "MCP server",
					get rows() {
						return z(a);
					},
					empty: "No turns attributed to an MCP server.",
					get pagerKey() {
						return `${z(t) ?? ""}-mcp-servers`;
					}
				});
			}
			T(ce), T(ae);
			var ue = F(ae, 2);
			{
				let e = /* @__PURE__ */ O(() => $("Rate limits and API errors"));
				Bu(ue, {
					id: "session-api-errors",
					get title() {
						return z(e);
					},
					get rows() {
						return z(o);
					},
					empty: "No API errors in this session.",
					get pagerKey() {
						return `${z(t) ?? ""}-api-errors`;
					},
					withSession: !1
				});
			}
			var de = F(ue, 2), fe = (e) => {
				jg(e, {
					get agents() {
						return z(n).agents;
					},
					get pagerKey() {
						return `${z(t) ?? ""}-tools`;
					}
				});
			};
			G(de, (e) => {
				z(n).transcript && e(fe);
			});
			var pe = F(de, 2), me = (e) => {
				Gh(e, {});
			};
			G(pe, (e) => {
				z(n).transcript || e(me);
			}), T(c), ri(c, () => bd({
				hide: ["filters", "summary"],
				focus: "#drilldown-title"
			})), I((e, t) => {
				W(u, e), W(m, t);
			}, [() => xc(z(n)), () => xd(z(n))]), U(e, c);
		}), U(e, c);
	};
	G(l, (e) => {
		z(n) && e(u);
	}), U(e, c), D();
}
//#endregion
//#region src/components/SummaryTiles.svelte
var Gg = /* @__PURE__ */ V([[
	"div",
	{ class: "empty" },
	" "
]]);
function Kg(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => Q.summary);
	var r = H(), i = N(r), a = (e) => {
		var r = H(), i = N(r), a = (e) => {
			{
				let t = /* @__PURE__ */ O(() => Md(z(n)));
				eg(e, {
					get totals() {
						return z(n).totals;
					},
					get scope() {
						return z(t);
					},
					get context() {
						return z(n).context;
					},
					get hintTokens() {
						return z(n).compact_hint_tokens;
					},
					get savings() {
						return z(n).compaction_savings;
					}
				});
			}
		}, o = (e) => {
			{
				let t = /* @__PURE__ */ O(() => Bd(z(n).runtime.sessions));
				ng(e, {
					get runtime() {
						return z(n).runtime;
					},
					get from() {
						return z(t);
					},
					get costPer100Lines() {
						return z(n).runtime.cost_per_100_lines;
					}
				});
			}
		};
		G(i, (e) => {
			t.rows === "kpis" ? e(a) : e(o, -1);
		}), U(e, r);
	}, o = (e) => {
		var t = Gg(), n = P(t, !0);
		I(() => W(n, Q.summaryFailed ? "Could not load the summary." : "Loading…")), U(e, t);
	};
	G(i, (e) => {
		z(n) ? e(a) : t.rows === "kpis" && e(o, 1);
	}), U(e, r), D();
}
//#endregion
//#region src/components/UsageTables.svelte
var qg = /* @__PURE__ */ V([
	[
		"div",
		{ class: "grid-2 stack" },
		,
		" ",
		,
	],
	" ",
	,
	" ",
	[
		"div",
		{ class: "grid-2 stack" },
		,
		" ",
		,
	]
], 1);
function Jg(e, t) {
	E(t, !0);
	let n = /* @__PURE__ */ O(() => Q.summary), r = /* @__PURE__ */ O(() => z(n) ? Wd(z(n).agent_type, (e) => e.agent_type) : null), i = /* @__PURE__ */ O(() => z(n) ? $i([...new Set(z(n).day_model.map((e) => e.model))]) : null), a = /* @__PURE__ */ O(() => z(n) && z(i) ? Gd(z(n).model, z(n).model_effort, z(i)) : null), o = /* @__PURE__ */ O(() => z(n) ? Wd(z(n).project, (e) => e.project) : null), s = /* @__PURE__ */ O(() => z(n) ? Wd(z(n).skill, (e) => e.skill) : null), c = /* @__PURE__ */ O(() => z(n) ? Wd(z(n).mcp_server, (e) => e.mcp_server) : null);
	var l = qg(), u = N(l), d = M(u);
	{
		let e = /* @__PURE__ */ O(() => $("By agent type"));
		Bg(d, {
			id: "by-agent",
			get title() {
				return z(e);
			},
			nameLabel: "Agent type",
			get rows() {
				return z(r);
			},
			empty: "No usage in this range."
		});
	}
	var f = F(d, 2);
	{
		let e = /* @__PURE__ */ O(() => $("By model"));
		Bg(f, {
			id: "by-model",
			get title() {
				return z(e);
			},
			nameLabel: "Model",
			get rows() {
				return z(a);
			},
			empty: "No usage in this range."
		});
	}
	T(u);
	var p = F(u, 2);
	{
		let e = /* @__PURE__ */ O(() => $("By project"));
		Bg(p, {
			id: "by-project",
			get title() {
				return z(e);
			},
			nameLabel: "Project",
			get rows() {
				return z(o);
			},
			empty: "No usage in this range."
		});
	}
	var m = F(p, 2), h = M(m);
	{
		let e = /* @__PURE__ */ O(() => $("By skill"));
		Bg(h, {
			id: "by-skill",
			get title() {
				return z(e);
			},
			note: "turns Claude Code attributes to a skill while it runs",
			nameLabel: "Skill",
			get rows() {
				return z(s);
			},
			empty: "No turns attributed to a skill in this range."
		});
	}
	var g = F(h, 2);
	{
		let e = /* @__PURE__ */ O(() => $("By MCP server"));
		Bg(g, {
			id: "by-mcp-server",
			get title() {
				return z(e);
			},
			note: "turns Claude Code attributes to an MCP server's tools",
			nameLabel: "MCP server",
			get rows() {
				return z(c);
			},
			empty: "No turns attributed to an MCP server in this range."
		});
	}
	T(m), U(e, l), D();
}
//#endregion
//#region src/lib/banner.svelte.ts
var Yg = class {
	#e = new To();
	#t = /* @__PURE__ */ O(() => [...this.#e.values()].filter((e, t, n) => n.indexOf(e) === t).join("\n"));
	get text() {
		return z(this.#t);
	}
	show(e, t) {
		t ? this.#e.set(e, t) : this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
}, Xg = [
	ha,
	Zi,
	Rc,
	il,
	ko,
	Na,
	rs,
	ds,
	Ps,
	Os,
	Eo,
	su,
	hu
];
function Zg(e) {
	let t = new Yg(), n = e.document.getElementById("error");
	if (!n?.parentElement) throw Error("The page has no #error placeholder for the banner");
	let r = ["kpis", "runtime"].map((t) => {
		let n = e.document.getElementById(t);
		if (!n) throw Error(`The page has no #${t} container for the tiles`);
		return {
			id: t,
			container: n
		};
	}), i = e.document.getElementById("live-card");
	if (!i) throw Error("The page has no #live-card container for the live sessions");
	let a = e.document.getElementById("trend-card");
	if (!a) throw Error("The page has no #trend-card container for the over-time section");
	let o = e.document.getElementById("chart-card");
	if (!o) throw Error("The page has no #chart-card container for the by-model section");
	let s = e.document.getElementById("costly-card");
	if (!s) throw Error("The page has no #costly-card container for the cost-per-session section");
	let c = e.document.getElementById("limits-card");
	if (!c) throw Error("The page has no #limits-card container for the rate-limits section");
	let l = e.document.getElementById("usage-cards");
	if (!l) throw Error("The page has no #usage-cards container for the usage tables");
	let u = e.document.getElementById("sessions-card");
	if (!u) throw Error("The page has no #sessions-card container for the sessions list");
	let d = e.document.getElementById("filters");
	if (!d) throw Error("The page has no #filters container for the range filter");
	let f = e.document.getElementById("session-card");
	if (!f) throw Error("The page has no #session-card container for the session view");
	let p = zr(Hi, {
		target: n.parentElement,
		anchor: n,
		props: { messages: t }
	});
	n.remove();
	let m = r.map(({ id: e, container: t }) => zr(Kg, {
		target: t,
		props: { rows: e }
	})), h = zr(Fl, { target: i }), g = zr(ou, { target: a }), _ = zr(vc, { target: o }), v = zr(Lc, { target: s }), y = zr(sd, { target: c }), ee = zr(Jg, { target: l }), b = zr(_d, { target: u }), x = zr(Su, { target: d }), S = zr(Wg, { target: f });
	return e.showError = (e, n) => {
		t.show(e, n), Pt();
	}, e.hasError = (e) => t.has(e), Object.assign(e, ...Xg), { stop() {
		Ur(p);
		for (let e of m) Ur(e);
		Ur(h), Ur(g), Ur(_), Ur(v), Ur(y), Ur(ee), Ur(b), Ur(x), Ur(S), Reflect.deleteProperty(e, "showError"), Reflect.deleteProperty(e, "hasError");
		for (let t of Xg.flatMap((e) => Object.keys(e))) Reflect.deleteProperty(e, t);
	} };
}
//#endregion
//#region src/main.ts
Zg(window);
//#endregion
