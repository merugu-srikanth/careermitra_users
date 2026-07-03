import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import InternshipGuideContent from "../components/InternshipGuideContent";
import {
  Calendar,
  Building2,
  Search,
  Eye,
  X,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  DollarSign,
  Award
} from "lucide-react";

const BASE_URL = "https://careermitra.in/api/internships";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const normalizeLink = (link) => {
  if (!link) return null;
  return link.startsWith("http") ? link : `https://${link}`;
};

export default function Internships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    internship_types: [],
    domains: [],
    states: [],
    cities: [],
    stipend_categories: []
  });

  // Selected filters
  const [selectedType, setSelectedType] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStipend, setSelectedStipend] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Sentinel ref for infinite scroll
  const sentinelRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${BASE_URL}/filters`);
        const json = await res.json();
        if (json && json.success && json.data) {
          setFilters({
            internship_types: json.data.internship_types || [],
            domains: json.data.domains || [],
            states: json.data.states || [],
            cities: json.data.cities || [],
            stipend_categories: json.data.stipend_categories || ["Paid", "Unpaid"]
          });
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch Internships list
  const fetchInternships = async () => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      params.append("sort", "newest");
      if (selectedType) params.append("internship_type", selectedType);
      if (selectedDomain) params.append("domain_sector", selectedDomain);
      if (selectedState) params.append("state", selectedState);
      if (selectedCity) params.append("district_city", selectedCity);
      if (selectedStipend) params.append("stipend_category", selectedStipend);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        const newItems = json.data.internships || [];
        setInternships((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
        const pag = json.data.pagination;
        if (pag) {
          setTotalPages(pag.totalPages || 1);
          setTotalItems(pag.total || 0);
        }
      } else {
        setError(json.message || "Failed to retrieve internships");
      }
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Unable to connect to the internships database.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [page, selectedType, selectedDomain, selectedState, selectedCity, selectedStipend, debouncedSearch]);

  // Infinite Scroll Observer Effect
  useEffect(() => {
    if (loading || loadingMore) return;
    if (page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loading, loadingMore, page, totalPages]);

  const handleViewDetails = (id, title) => {
    const slug = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : "details";
    navigate(`/internships/${slug}`, { state: { id } });
  };

  const clearFilters = () => {
    setSelectedType("");
    setSelectedDomain("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedStipend("");
    setSearchQuery("");
    setPage(1);
  };


  return (
    <div className="relative min-h-screen bg-slate-50/50 py-8 px-4 md:px-8 font-sans">
      <SEO
        title="Internship Opportunities 2026, Apply for Verified Internships | Career Mitra"
        description="Search and apply for verified internship opportunities across states, sectors, and roles. Find virtual, paid, and unpaid internships."
        keywords="Internships, Virtual Internships, Paid Internships, Government Internships, Career Mitra"
        url="https://careermitra.in/internships"
      />

      <div className="max-w-7xl mx-auto z-10 relative pt-20">
        {/* Header Block */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3 animate-pulse">
            <Briefcase className="w-3.5 h-3.5" />
            Verified Internship Portal
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-none mb-3">
            Explore <span className="text-orange-600">Internships</span>
          </h1>
          <p className="text-slate-500 text-base max-w-2xl">
            Find the perfect opportunity to kickstart your professional journey. Filter through hundreds of approved listings.
          </p>
        </div>

        {/* Filter Panel */}
        <div className="bg-white rounded-3xl border border-orange-100/85 shadow-md shadow-orange-100/20 p-5 md:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Search</label>
              <div className="relative">
                <Search className="w-4 h-4 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="HCL, Meesho, Wipro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Internship Type Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-slate-50/50 text-slate-700"
              >
                <option value="">All Types</option>
                {filters.internship_types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Domain Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => { setSelectedDomain(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-slate-50/50 text-slate-700"
              >
                <option value="">All Domains</option>
                {filters.domains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-slate-50/50 text-slate-700"
              >
                <option value="">All States</option>
                {filters.states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* City/District Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">City / District</label>
              <select
                value={selectedCity}
                disabled={!selectedState}
                onChange={(e) => { setSelectedCity(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-slate-50/50 text-slate-700 disabled:opacity-50"
              >
                <option value="">{selectedState ? "All Cities" : "Select State First"}</option>
                {filters.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100">
            {/* Stipend Category Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stipend:</span>
              <div className="inline-flex rounded-xl p-1 bg-slate-100">
                <button
                  onClick={() => { setSelectedStipend(""); setPage(1); }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${!selectedStipend ? "bg-white text-orange-600 shadow" : "text-slate-500 hover:text-slate-800"}`}
                >
                  All
                </button>
                {filters.stipend_categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedStipend(cat); setPage(1); }}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${selectedStipend === cat ? "bg-white text-orange-600 shadow" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">{totalItems} results found</span>
              {(selectedType || selectedDomain || selectedState || selectedCity || selectedStipend || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="space-y-4">
            <div className="hidden md:block rounded-3xl border border-orange-50 bg-white shadow-sm overflow-hidden animate-pulse">
              <div className="h-12 bg-slate-100/80" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 border-t border-slate-100 bg-white" />
              ))}
            </div>
            <div className="md:hidden space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white h-40 rounded-3xl animate-pulse border border-slate-100" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50/50 border border-red-200 text-red-700 rounded-3xl p-6 text-center">
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchInternships}
              className="mt-3 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow"
            >
              Retry Connection
            </button>
          </div>
        ) : internships.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800">No Internships Found</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              We couldn't find any approved internships matching your filters. Try clearing some criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-3xl border border-orange-100/50 shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-b border-orange-100">
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">#</th>
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Internship Details</th>
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Type & Domain</th>
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Location</th>
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Stipend & Duration</th>
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Openings</th>
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {internships.map((intern, idx) => (
                      <tr key={intern.id} className="hover:bg-orange-50/30 transition-all duration-150 group">
                        <td className="px-5 py-4 text-xs font-bold text-slate-400">
                          {(page - 1) * limit + idx + 1}
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <h3
                            onClick={() => handleViewDetails(intern.id, intern.internship_title)}
                            className="text-sm text-slate-800 leading-snug group-hover:text-orange-600 transition-colors cursor-pointer"
                          >
                            {intern.internship_title}
                          </h3>
                          <p className="text-xs font-bold  text-slate-500 flex items-center gap-1 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {intern.company_name}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 mb-1">
                            {intern.internship_type}
                          </span>
                          {/* <p className="text-xs text-slate-600 truncate max-w-[150px]">{intern.domain_sector}</p> */}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {intern.location || `${intern.district_city}, ${intern.state}`}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-xs font-bold text-green-700 mb-1">
                            <DollarSign className="w-3 h-3" />
                            {intern.stipend_category === "Paid" ? intern.stipend : "Unpaid"}
                          </span>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {intern.duration}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600">
                          <div className="font-semibold text-slate-800">
                            {intern.openings} Openings
                          </div>
                          {/* {intern.no_of_credits > 0 && (
                            <p className="text-[10px] text-orange-500 font-bold mt-0.5">
                              {intern.no_of_credits} Credits
                            </p>
                          )} */}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(intern.id, intern.internship_title)}
                              className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {intern.apply_link && (
                              <a
                                href={normalizeLink(intern.apply_link)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow hover:shadow-orange-100"
                              >
                                Apply <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {internships.map((intern) => (
                <div key={intern.id} className="bg-white rounded-3xl border border-orange-100/50 shadow-sm p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-[80px] -z-0 opacity-50" />

                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-orange-50 rounded-2xl text-orange-500 shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3
                          onClick={() => handleViewDetails(intern.id, intern.internship_title)}
                          className="text-sm font-bold text-slate-800 leading-snug cursor-pointer hover:text-orange-600 transition-colors"
                        >
                          {intern.internship_title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">{intern.company_name}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded bg-orange-50 text-[10px] font-bold text-orange-600">
                        {intern.internship_type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-green-50 text-[10px] font-bold text-green-600">
                        {intern.stipend_category}
                      </span>
                      {intern.no_of_credits > 0 && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-600">
                          {intern.no_of_credits} Credits
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Location</span>
                        <span className="font-semibold truncate block">{intern.location || `${intern.district_city}, ${intern.state}`}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400">Duration</span>
                        <span className="font-semibold block">{intern.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(intern.id, intern.internship_title)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                      {intern.apply_link && (
                        <a
                          href={normalizeLink(intern.apply_link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 rounded-xl transition-all"
                        >
                          Apply <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Sentinel and Load More Loading indicator */}
            <div ref={sentinelRef} className="h-4 w-full" />

            {loadingMore && (
              <div className="flex justify-center items-center py-6 mt-4 bg-white rounded-2xl border border-orange-100/50 shadow-sm">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-xs font-bold text-slate-500">Loading more internships...</span>
              </div>
            )}
          </>
        )}

        {/* Beautiful Internship Guide Article Section */}
        <div className="mt-16">
          <InternshipGuideContent />
        </div>
      </div>
    </div>
  );
}
