import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../lib/supabaseClient';


export default function EnrollmentPage() {
const { enrollmentId } = useParams();
const [enrollment, setEnrollment] = useState(null);
const [loading, setLoading] = useState(true);


useEffect(() => {
let mounted = true;
async function load() {
setLoading(true);
const { data } = await supabase
.from('enrollments')
.select('*, course:course_id (id, title), student:student_id (id, full_name)')
.eq('id', enrollmentId)
.single();
if (mounted) setEnrollment(data);
setLoading(false);
}
load();
return () => { mounted = false; };
}, [enrollmentId]);


if (loading) return <div className="p-6">Loading...</div>;
if (!enrollment) return <div className="p-6">Enrollment not found.</div>;


return (
<div className="pt-30">
<h1 className="text-2xl font-semibold">Enrollment Details</h1>
<div className="mt-4 p-4 border rounded">
<div className="font-medium">Course: {enrollment.course?.title}</div>
<div className="text-sm text-gray-600">Student: {enrollment.student?.full_name}</div>
<div className="mt-3">
<label className="block text-sm">Progress (%)</label>
<progress value={enrollment.progress ?? 0} max="100" className="w-full" />
</div>
</div>
</div>
);
}