import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabaseClient';


export default function ProtectedRoute({ children, role, requireEnrollment }) {
const { user, loading } = useAuth();
const location = useLocation();
const params = useParams();


if (loading) return <div className="p-6">Checking authentication...</div>;
if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
if (role && user.role !== role && user.role === 'instructor') {
// allow admin to access any role area
return <div className="p-6">You don't have permission to view this page.</div>;
}


if (requireEnrollment && params.courseId) {
// synchronous fallback while checking: we will block render until verified
const [allowed, setAllowed] = React.useState(null);


React.useEffect(() => {
let mounted = true;
async function check() {
const { data, error } = await supabase
.from('enrollments')
.select('*')
.match({ student_id: user.id, course_id: params.courseId });
if (mounted) setAllowed(Array.isArray(data) && data.length > 0);
}
check();
return () => { mounted = false; };
}, [params.courseId, user.id]);


if (allowed === null) return <div className="p-6">Checking enrollment...</div>;
if (!allowed) return <div className="p-6">You must enroll in this course to access lessons.</div>;
}


return children;
}