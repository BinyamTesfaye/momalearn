import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';


export function useCourses({ perPage = 12 } = {}) {
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(false);
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);
const [query, setQuery] = useState('');
const [category, setCategory] = useState('');


useEffect(() => {
let mounted = true;
async function load() {
setLoading(true);
const from = (page - 1) * perPage;
const to = from + perPage - 1;


let builder = supabase.from('courses').select('id,title,description,thumbnail,level,category,created_at', { count: 'exact' });
if (query) builder = builder.ilike('title', `%${query}%`);
if (category) builder = builder.eq('category', category);
builder = builder.order('created_at', { ascending: false }).range(from, to);


const { data, count, error } = await builder;
if (error) console.error(error);
if (!mounted) return;
setCourses(data ?? []);
setTotal(count ?? 0);
setLoading(false);
}


load();
return () => { mounted = false; };
}, [page, perPage, query, category]);


return {
courses,
loading,
page,
total,
perPage,
nextPage: () => setPage(p => p + 1),
prevPage: () => setPage(p => Math.max(1, p - 1)),
setPage,
setQuery,
setCategory,
};
}