"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { generateCollectionPageSchema, generateItemListSchema, generateTableSchema } from '@/utils/schemaHelpers';
import InternshipGuideContent from '@/components/InternshipGuideContent';
import { isDeadlineExpired } from "@/utils/jobDeadline";

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
  IndianRupee,
  Award,
  ChevronDown,
  Check,
  AlertCircle,
  Sparkles,
  BookOpen,
  Star,
  Users,
  ArrowRight,
  Layers,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Filter,
  Rocket,
  Code,
  GraduationCap,
  Zap,
  TrendingUp,
  LayoutGrid,
  ListFilter,
  FileText
} from "lucide-react";

import { API_BASE_URL } from "@/utils/api";

const BASE_URL = `${API_BASE_URL}/internships`;
const SKILLUPS_API_BASE = `${API_BASE_URL}/jobs`;

const formatDateDDMMYYYY = (value) => {
  if (!value) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const dd = String(parsed.getDate()).padStart(2, "0");
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const yyyy = parsed.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const normalizeLink = (link) => {
  if (!link) return null;
  return link.startsWith("http") ? link : `https://${link}`;
};

const generateSlug = (title) => {
  return title
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "";
};

const mapDynamicSkillUp = (j) => {
  const deadline = j.application_deadline || j.lastDate || null;
  return {
    id: j._id || j.id,
    title: j.title || "SkillUp Opportunity",
    org: j.source_name || j.sourceName || j.org || "SWAYAM / Ministry of Education",
    category: j.category_name || j.categoryName || j.category || "Skill Development",
    qualifications: j.qualifications && j.qualifications !== "Not available in the website"
      ? j.qualifications
      : "Open to all students, graduates & working professionals",
    applyLink: j.apply_link || j.applyLink || null,
    notificationUrl: j.notification_url || j.notificationUrl || null,
    postedDate: j.posted_date || j.postedDate || null,
    deadline: deadline,
    isExpired: isDeadlineExpired(deadline),
    age: j.age && j.age !== "-" ? j.age : "No Age Limit",
    posts: j.no_of_posts ?? j.noOfPosts ?? 1,
    status: j.status || "approved",
    type: "skillup",
  };
};

function FilterDropdown({
  label,
  value,
  options = [],
  placeholder = "Select",
  onChange,
  disabled = false,
  searchable = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedOption = options.find((opt) =>
    typeof opt === "string" ? opt === value : opt.value === value
  );
  const displayLabel = selectedOption
    ? typeof selectedOption === "string"
      ? selectedOption
      : selectedOption.label
    : placeholder;
  const fullTooltip = selectedOption
    ? typeof selectedOption === "string"
      ? selectedOption
      : (selectedOption.fullText || selectedOption.label)
    : "";

  const filteredOptions = useMemo(() => {
    if (!filterSearch.trim()) return options;
    const q = filterSearch.toLowerCase();
    return options.filter((opt) => {
      const text = typeof opt === "string" ? opt : (opt.fullText || opt.label);
      return text.toLowerCase().includes(q);
    });
  }, [options, filterSearch]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
            setFilterSearch("");
          }
        }}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm rounded-xl border transition-all cursor-pointer text-left ${
          disabled
            ? "bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed"
            : value
            ? "bg-orange-50 border-orange-300 text-orange-950 font-medium shadow-2xs"
            : "bg-slate-50/60 hover:bg-white border-slate-200 hover:border-orange-300 text-slate-700"
        }`}
      >
        <span className="truncate block" title={fullTooltip || displayLabel}>
          {displayLabel}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180 text-orange-500" : "text-slate-400"
          }`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[200px] max-w-[280px] bg-white border border-slate-200/90 rounded-2xl shadow-xl z-30 p-1.5 overflow-hidden">
          {searchable && options.length > 5 && (
            <div className="p-1 pb-1.5 border-b border-slate-100 mb-1">
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-400 font-normal"
              />
            </div>
          )}

          <div className="max-h-56 overflow-y-auto space-y-0.5" style={{ scrollbarWidth: "thin" }}>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between ${
                !value
                  ? "bg-orange-500 text-white font-semibold"
                  : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <span>{placeholder}</span>
              {!value && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
            </button>

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2.5 text-xs text-slate-400 text-center">No options found</div>
            ) : (
              filteredOptions.map((opt) => {
                const optVal = typeof opt === "string" ? opt : opt.value;
                const optLabel = typeof opt === "string" ? opt : opt.label;
                const optTooltip = typeof opt === "string" ? opt : (opt.fullText || opt.label);
                const isSelected = value === optVal;

                return (
                  <button
                    key={optVal}
                    type="button"
                    onClick={() => {
                      onChange(optVal);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between group ${
                      isSelected
                        ? "bg-orange-500 text-white font-semibold"
                        : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <span className="truncate block pr-2" title={optTooltip}>
                      {optLabel}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InternshipsClient({
  initialInternships = [],
  initialPagination = null,
  initialSkillups = [],
  initialSkillupsPagination = null,
  initialFilters = null,
  initialError = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state: "internships" | "skillups"
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabFromUrl === "skillups" ? "skillups" : "internships"
  );

  useEffect(() => {
    if (tabFromUrl === "skillups" || tabFromUrl === "internships") {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    const newUrl = tab === "skillups" ? "/internships?tab=skillups" : "/internships";
    window.history.replaceState(null, "", newUrl);
  };

  /* ─────────────────────────────────────────────────────────────────────────────
     INTERNSHIPS TAB STATE & LOGIC
  ───────────────────────────────────────────────────────────────────────────── */
  const [internships, setInternships] = useState(initialInternships || []);
  const [loading, setLoading] = useState(initialInternships && initialInternships.length > 0 ? false : true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(initialInternships && initialInternships.length > 0 ? null : initialError);

  const [filters, setFilters] = useState(initialFilters || {
    internship_types: [],
    domains: [],
    states: [],
    cities: [],
    stipend_categories: ["Paid", "Unpaid"]
  });

  const [selectedType, setSelectedType] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStipend, setSelectedStipend] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const cleanStates = useMemo(() => {
    if (!filters.states || !Array.isArray(filters.states)) return [];
    const unique = Array.from(new Set(filters.states.filter(Boolean)));
    return unique
      .map((st) => ({
        value: st,
        label: st.length > 28 ? st.slice(0, 28) + "…" : st,
        fullText: st,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filters.states]);

  const cleanCities = useMemo(() => {
    if (!filters.cities || !Array.isArray(filters.cities)) return [];
    const unique = Array.from(new Set(filters.cities.filter(Boolean)));
    return unique
      .map((ct) => ({
        value: ct,
        label: ct.length > 28 ? ct.slice(0, 28) + "…" : ct,
        fullText: ct,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [filters.cities]);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(initialPagination?.totalPages || 1);
  const [totalItems, setTotalItems] = useState(initialPagination?.total ?? (initialInternships?.length || 0));
  const [globalCounts, setGlobalCounts] = useState({ active: 913, expired: 3283, total: 4196 });

  useEffect(() => {
    const fetchGlobalCounts = async () => {
      try {
        const [activeRes, expiredRes] = await Promise.all([
          fetch(`${BASE_URL}?page=1&limit=1&expired=false`).then(r => r.json()),
          fetch(`${BASE_URL}?page=1&limit=1&expired=true`).then(r => r.json())
        ]);
        const active = activeRes.data?.pagination?.total || 0;
        const expired = expiredRes.data?.pagination?.total || 0;
        if (active || expired) {
          setGlobalCounts({ active, expired, total: active + expired });
        }
      } catch (err) {
        console.error("Failed to fetch internship status counts:", err);
      }
    };
    fetchGlobalCounts();
  }, []);

  const initialMountRef = useRef(true);
  const [allInternships, setAllInternships] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchVisibleCount, setSearchVisibleCount] = useState(20);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBarRef = useRef(null);
  const [dropdownRect, setDropdownRect] = useState(null);

  const trimmedSearch = debouncedSearch.trim();
  const isSearchMode = trimmedSearch.length > 0;
  const rawQuery = searchQuery.trim();

  useEffect(() => {
    if (!showSuggestions || !rawQuery) return;
    const updateRect = () => {
      if (!searchBarRef.current) return;
      const rect = searchBarRef.current.getBoundingClientRect();
      setDropdownRect({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [showSuggestions, rawQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setSearchVisibleCount(limit);
  }, [debouncedSearch, selectedType, selectedDomain, selectedState, selectedCity, selectedStipend, limit]);

  const fetchAllForSearch = async () => {
    try {
      setAllLoading(true);
      setSearchError(null);

      const first = await fetch(`${BASE_URL}?page=1&limit=100&sort=newest`);
      const firstJson = await first.json();
      if (!firstJson.success) throw new Error(firstJson.message || "Failed to load internships");

      let items = firstJson.data.internships || [];
      const totalPagesAll = firstJson.data.pagination?.totalPages || 1;

      if (totalPagesAll > 1) {
        const pagePromises = [];
        for (let p = 2; p <= totalPagesAll; p++) {
          pagePromises.push(fetch(`${BASE_URL}?page=${p}&limit=100&sort=newest`).then((r) => r.json()));
        }
        const results = await Promise.all(pagePromises);
        results.forEach((r) => {
          if (r.success) items = items.concat(r.data.internships || []);
        });
      }

      setAllInternships(items);
      setAllLoaded(true);
    } catch (err) {
      console.error("Error fetching internships for search:", err);
      setSearchError("Unable to load internships for search.");
    } finally {
      setAllLoading(false);
    }
  };

  useEffect(() => {
    if (rawQuery.length > 0 && !allLoaded && !allLoading) {
      fetchAllForSearch();
    }
  }, [rawQuery, allLoaded, allLoading]);

  const suggestions = useMemo(() => {
    if (!rawQuery || !allLoaded) return [];
    const words = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);

    const scored = allInternships
      .map((item) => {
        const haystack = [
          item.internship_title,
          item.company_name,
          item.domain_sector,
          item.internship_type,
          item.location,
          item.district_city,
          item.state
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0);
        return { item, score };
      })
      .filter((entry) => entry.score > 0);

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.item.created_at || 0) - new Date(a.item.created_at || 0);
    });

    return scored.slice(0, 8).map((entry) => entry.item);
  }, [rawQuery, allLoaded, allInternships]);

  const searchMatches = useMemo(() => {
    if (!isSearchMode) return [];
    const words = trimmedSearch.toLowerCase().split(/\s+/).filter(Boolean);

    const filtered = allInternships.filter((item) => {
      if (selectedType && item.internship_type !== selectedType) return false;
      if (selectedDomain && item.domain_sector !== selectedDomain) return false;
      if (selectedState && item.state !== selectedState) return false;
      if (selectedCity && item.district_city !== selectedCity) return false;
      if (selectedStipend && item.stipend_category !== selectedStipend) return false;
      if (selectedStatus === "active" && item.is_expired) return false;
      if (selectedStatus === "expired" && !item.is_expired) return false;
      return true;
    });

    const scored = filtered
      .map((item) => {
        const haystack = [
          item.internship_title,
          item.company_name,
          item.domain_sector,
          item.internship_type,
          item.location,
          item.district_city,
          item.state
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0);
        return { item, score };
      })
      .filter((entry) => entry.score > 0);

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.item.created_at || 0) - new Date(a.item.created_at || 0);
    });

    return scored.map((entry) => entry.item);
  }, [isSearchMode, trimmedSearch, allInternships, selectedType, selectedDomain, selectedState, selectedCity, selectedStipend, selectedStatus]);

  const statusCounts = useMemo(() => {
    if (allLoaded && allInternships.length > 0) {
      const filtered = allInternships.filter((item) => {
        if (selectedType && item.internship_type !== selectedType) return false;
        if (selectedDomain && item.domain_sector !== selectedDomain) return false;
        if (selectedState && item.state !== selectedState) return false;
        if (selectedCity && item.district_city !== selectedCity) return false;
        if (selectedStipend && item.stipend_category !== selectedStipend) return false;
        if (trimmedSearch) {
          const words = trimmedSearch.toLowerCase().split(/\s+/).filter(Boolean);
          const haystack = [
            item.internship_title,
            item.company_name,
            item.domain_sector,
            item.internship_type,
            item.location,
            item.district_city,
            item.state
          ].filter(Boolean).join(" ").toLowerCase();
          if (!words.some((w) => haystack.includes(w))) return false;
        }
        return true;
      });

      const active = filtered.filter((i) => !i.is_expired).length;
      const expired = filtered.filter((i) => i.is_expired).length;
      return { active, expired, total: filtered.length };
    }
    return globalCounts;
  }, [allLoaded, allInternships, selectedType, selectedDomain, selectedState, selectedCity, selectedStipend, trimmedSearch, globalCounts]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const query = selectedState ? `?state=${encodeURIComponent(selectedState)}` : "";
        const res = await fetch(`${BASE_URL}/filters${query}`);
        const json = await res.json();
        if (json && json.success && json.data) {
          setFilters((prev) => ({
            internship_types: json.data.internship_types || prev.internship_types || [],
            domains: json.data.domains || prev.domains || [],
            states: json.data.states || prev.states || [],
            cities: json.data.cities || [],
            stipend_categories: json.data.stipend_categories || ["Paid", "Unpaid"]
          }));
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
      }
    };
    fetchFilters();
  }, [selectedState]);

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
      if (selectedStatus) params.append("expired", selectedStatus === "expired" ? "true" : "false");

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
    if (isSearchMode) return;
    if (initialMountRef.current) {
      initialMountRef.current = false;
      if (
        initialInternships &&
        initialInternships.length > 0 &&
        page === 1 &&
        !selectedType &&
        !selectedDomain &&
        !selectedState &&
        !selectedCity &&
        !selectedStipend &&
        !selectedStatus
      ) {
        return;
      }
    }
    fetchInternships();
  }, [page, selectedType, selectedDomain, selectedState, selectedCity, selectedStipend, selectedStatus, isSearchMode]);

  const canLoadMore = isSearchMode ? searchVisibleCount < searchMatches.length : page < totalPages;

  const handleLoadMore = () => {
    if (isSearchMode) {
      setSearchVisibleCount((prev) => Math.min(prev + limit, searchMatches.length));
      return;
    }
    if (loadingMore || page >= totalPages) return;
    setPage((prev) => prev + 1);
  };

  const clearFilters = () => {
    setSelectedType("");
    setSelectedDomain("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedStipend("");
    setSelectedStatus("");
    setSearchQuery("");
    setPage(1);
  };

  const displayedInternships = isSearchMode ? searchMatches.slice(0, searchVisibleCount) : internships;
  const displayedTotal = isSearchMode ? searchMatches.length : totalItems;
  const isLoading = isSearchMode ? allLoading && !allLoaded : loading;
  const displayedError = isSearchMode ? searchError : error;
  const retryFetch = isSearchMode ? fetchAllForSearch : fetchInternships;

  /* ─────────────────────────────────────────────────────────────────────────────
     DYNAMIC SKILLUPS (API-DRIVEN) STATE & LOGIC
  ───────────────────────────────────────────────────────────────────────────── */
  const [skillupsList, setSkillupsList] = useState(
    initialSkillups && initialSkillups.length > 0
      ? initialSkillups.map(mapDynamicSkillUp)
      : []
  );
  const [allSkillups, setAllSkillups] = useState([]);
  const [skillupsLoaded, setSkillupsLoaded] = useState(false);
  const [skillupsLoading, setSkillupsLoading] = useState(false);
  const [skillupsError, setSkillupsError] = useState(null);

  const [skillSearch, setSkillSearch] = useState("");
  const [selectedSkillOrg, setSelectedSkillOrg] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("All Categories");
  const [selectedSkillStatus, setSelectedSkillStatus] = useState("all");
  const [skillViewMode, setSkillViewMode] = useState("cards"); // "cards" | "table"
  const [selectedSkillDetail, setSelectedSkillDetail] = useState(null);

  // Fetch all skillups dynamically from API
  const fetchDynamicSkillUps = async () => {
    try {
      setSkillupsLoading(true);
      setSkillupsError(null);

      // Fetch all pages of skillups
      let allItems = [];
      const firstRes = await fetch(`${SKILLUPS_API_BASE}?job_type=skillup&page=1&limit=100&sort=newest`);
      const firstJson = await firstRes.json();

      if (firstJson.success && firstJson.data?.jobs) {
        allItems = firstJson.data.jobs.map(mapDynamicSkillUp);
        const totalPages = firstJson.data.pagination?.totalPages || 1;
        if (totalPages > 1) {
          const promises = [];
          for (let p = 2; p <= totalPages; p++) {
            promises.push(
              fetch(`${SKILLUPS_API_BASE}?job_type=skillup&page=${p}&limit=100&sort=newest`).then(r => r.json())
            );
          }
          const results = await Promise.all(promises);
          results.forEach(res => {
            if (res.success && res.data?.jobs) {
              allItems = allItems.concat(res.data.jobs.map(mapDynamicSkillUp));
            }
          });
        }
      }

      setAllSkillups(allItems);
      setSkillupsList(allItems);
      setSkillupsLoaded(true);
    } catch (err) {
      console.error("Error fetching dynamic skillups:", err);
      setSkillupsError("Unable to load dynamic skill development opportunities.");
    } finally {
      setSkillupsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "skillups" && !skillupsLoaded && !skillupsLoading) {
      fetchDynamicSkillUps();
    }
  }, [activeTab, skillupsLoaded, skillupsLoading]);

  // Derived Dynamic Categories & Organizations from API data
  const dynamicSkillCategories = useMemo(() => {
    const cats = new Set();
    allSkillups.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ["All Categories", ...Array.from(cats).sort()];
  }, [allSkillups]);

  const dynamicSkillOrgs = useMemo(() => {
    const orgs = new Set();
    allSkillups.forEach((s) => {
      if (s.org) orgs.add(s.org);
    });
    return Array.from(orgs).sort();
  }, [allSkillups]);

  // Dynamic SkillUps Filtering & Multi-field Searching
  const filteredDynamicSkillUps = useMemo(() => {
    let list = allSkillups.length > 0 ? allSkillups : skillupsList;

    if (selectedSkillCategory && selectedSkillCategory !== "All Categories") {
      list = list.filter((s) => s.category === selectedSkillCategory);
    }
    if (selectedSkillOrg) {
      list = list.filter((s) => s.org === selectedSkillOrg);
    }
    if (selectedSkillStatus === "active") {
      list = list.filter((s) => !s.isExpired);
    } else if (selectedSkillStatus === "expired") {
      list = list.filter((s) => s.isExpired);
    }

    if (skillSearch.trim()) {
      const q = skillSearch.toLowerCase().trim();
      const words = q.split(/\s+/).filter(Boolean);
      list = list.filter((s) => {
        const haystack = [s.title, s.org, s.category, s.qualifications].join(" ").toLowerCase();
        return words.every((w) => haystack.includes(w));
      });
    }

    return list;
  }, [allSkillups, skillupsList, selectedSkillCategory, selectedSkillOrg, selectedSkillStatus, skillSearch]);

  const clearSkillFilters = () => {
    setSkillSearch("");
    setSelectedSkillOrg("");
    setSelectedSkillCategory("All Categories");
    setSelectedSkillStatus("all");
  };

  /* ─────────────────────────────────────────────────────────────────────────────
     SEO SCHEMAS
  ───────────────────────────────────────────────────────────────────────────── */
  const tableSchema = useMemo(() => {
    if (activeTab !== "internships" || isLoading || displayedError || displayedInternships.length === 0) return null;
    return generateTableSchema({
      name: "Internship Opportunities",
      description: "Verified internship opportunities across states, sectors, and roles listed on Career Mitra.",
      url: "/internships",
      headers: ["#", "Internship Title", "Company", "Type", "Location", "Stipend", "Duration"],
      rows: displayedInternships.map((intern, idx) => [
        String(idx + 1),
        intern.internship_title || "N/A",
        intern.company_name || "N/A",
        intern.internship_type || "N/A",
        intern.location || [intern.district_city, intern.state].filter(Boolean).join(", ") || "N/A",
        intern.stipend_category === "Paid" ? (intern.stipend || "Paid") : "Unpaid",
        intern.duration || "N/A",
      ]),
    });
  }, [activeTab, displayedInternships, isLoading, displayedError]);

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50/40 via-white to-green-50/20 font-sans">
      {tableSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema).replace(/</g, "\\u003c") }}
        />
      )}

      {/* ── Hero Section (Styled to match latest-job-notifications) ── */}
      <div className="relative bg-linear-to-b from-orange-100 via-orange-100 to-orange-700 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-10 w-full mx-auto px-4 md:px-15 py-16 text-center mt-9">
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black mb-4 tracking-tight leading-none">
            {activeTab === "internships" ? (
              <>
                Explore <span className="text-orange-600">Internships</span>
              </>
            ) : (
              <>
                Explore <span className="text-orange-600">SkillUps</span>
              </>
            )}
          </h1>

          <p className="text-orange-600 text-xl max-w-2xl mx-auto mb-10">
            {activeTab === "internships"
              ? "Find verified virtual, paid, and government internship openings to kickstart your professional career."
              : "Discover accredited skill development programs, vocational certifications, and government upskilling courses."}
          </p>

          {/* ── TWO-TAB SWITCHER (Internships | SkillUps) ── */}
          <div className="inline-flex items-center p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-orange-200/80 shadow-lg mb-8">
            <button
              type="button"
              onClick={() => handleTabSwitch("internships")}
              className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all duration-200 cursor-pointer ${
                activeTab === "internships"
                  ? "bg-orange-500 text-white shadow-md scale-100"
                  : "text-slate-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Internships</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "internships"
                    ? "bg-white text-orange-600"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {globalCounts.active.toLocaleString()}+
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch("skillups")}
              className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all duration-200 cursor-pointer ${
                activeTab === "skillups"
                  ? "bg-orange-500 text-white shadow-md scale-100"
                  : "text-slate-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>SkillUps</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === "skillups"
                    ? "bg-white text-orange-600"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {allSkillups.length > 0 ? allSkillups.length : "65+"} Live
              </span>
            </button>
          </div>

          {/* ── DYNAMIC SEARCH BAR ── */}
          {activeTab === "internships" ? (
            <div className="max-w-2xl mx-auto relative">
              <div ref={searchBarRef} className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-2xl p-1.5 gap-2 border border-white/30">
                <div className="flex-1 flex items-center gap-2.5 px-3 min-w-0">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    suppressHydrationWarning={true}
                    type="text"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); setShowSuggestions(true); }}
                    onFocus={() => { if (rawQuery) setShowSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={(e) => { if (e.key === "Escape") setShowSuggestions(false); }}
                    placeholder="Search by Title, Stream, Company, City (e.g. Bio Science, HCL, Chennai)..."
                    className="flex-1 min-w-0 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent py-2.5"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  suppressHydrationWarning={true}
                  onClick={() => setShowSuggestions(false)}
                  className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-base font-bold px-4 md:px-15 py-2.5 rounded-xl transition-all duration-200 shadow-md shrink-0 w-full sm:w-auto cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && rawQuery && dropdownRect && typeof document !== "undefined" && createPortal(
                <div
                  style={{ position: "fixed", top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
                  className="z-100 bg-white border border-orange-100 rounded-2xl shadow-lg max-h-80 overflow-y-auto text-left"
                >
                  {!allLoaded ? (
                    <div className="px-4 py-3 text-xs text-slate-400 font-semibold">Loading suggestions...</div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400 font-semibold">No matches for "{rawQuery}"</div>
                  ) : (
                    suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchQuery(s.internship_title);
                          setPage(1);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-0 block cursor-pointer"
                      >
                        <p className="text-xs font-bold text-slate-800 truncate">{s.internship_title}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {s.company_name}
                          {(s.domain_sector && s.domain_sector !== "-") ? ` · ${s.domain_sector}` : (s.location ? ` · ${s.location}` : "")}
                        </p>
                      </button>
                    ))
                  )}
                </div>,
                document.body
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto relative">
              <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-2xl p-1.5 gap-2 border border-white/30">
                <div className="flex-1 flex items-center gap-2.5 px-3 min-w-0">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Search SkillUps by course, vocational skill, or provider (e.g. Yoga, Computing, Poultry)..."
                    className="flex-1 min-w-0 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent py-2.5"
                  />
                  {skillSearch && (
                    <button onClick={() => setSkillSearch("")} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-base font-bold px-4 md:px-15 py-2.5 rounded-xl transition-all duration-200 shadow-md shrink-0 w-full sm:w-auto cursor-pointer"
                >
                  Search Skills
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT BODY ── */}
      <div className="w-full mx-auto px-4 md:px-15 py-8">

        {/* ═════════════════════════════════════════════════════════════════════
            TAB 1: INTERNSHIPS CONTENT
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "internships" && (
          <div>
            {/* Filter Panel */}
            <div className="bg-white rounded-3xl border border-orange-100/85 shadow-md shadow-orange-100/20 p-5 md:p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <FilterDropdown
                  label="Internship Type"
                  placeholder="All Types"
                  value={selectedType}
                  options={filters.internship_types}
                  onChange={(val) => {
                    setSelectedType(val);
                    setPage(1);
                  }}
                />

                <FilterDropdown
                  label="Stipend"
                  placeholder="All Stipends"
                  value={selectedStipend}
                  options={filters.stipend_categories}
                  onChange={(val) => {
                    setSelectedStipend(val);
                    setPage(1);
                  }}
                />

                <FilterDropdown
                  label="State"
                  placeholder="All States"
                  value={selectedState}
                  options={cleanStates}
                  searchable={true}
                  onChange={(val) => {
                    setSelectedState(val);
                    setSelectedCity("");
                    setPage(1);
                  }}
                />

                <FilterDropdown
                  label="City / District"
                  placeholder={selectedState ? "All Cities" : "Select State First"}
                  value={selectedCity}
                  options={cleanCities}
                  disabled={!selectedState}
                  searchable={true}
                  onChange={(val) => {
                    setSelectedCity(val);
                    setPage(1);
                  }}
                />

                <FilterDropdown
                  label="Status"
                  placeholder="All Status"
                  value={selectedStatus}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "expired", label: "Expired" },
                  ]}
                  onChange={(val) => {
                    setSelectedStatus(val);
                    setPage(1);
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {(selectedType || selectedDomain || selectedState || selectedCity || selectedStipend || selectedStatus || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Clear Filters
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active: {statusCounts.active.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Expired: {statusCounts.expired.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold ml-1">
                    ({isSearchMode && allLoading && !allLoaded ? "Searching..." : `${displayedTotal.toLocaleString()} listings found`})
                  </span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
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
            ) : displayedError ? (
              <div className="bg-red-50/50 border border-red-200 text-red-700 rounded-3xl p-6 text-center">
                <p className="font-bold">{displayedError}</p>
                <button
                  onClick={retryFetch}
                  className="mt-3 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Retry Connection
                </button>
              </div>
            ) : displayedInternships.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
                <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-800">No Internships Found</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  {isSearchMode
                    ? `We couldn't find anything related to "${trimmedSearch}". Try a different keyword.`
                    : "We couldn't find any approved internships matching your filters. Try clearing some criteria."}
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
                          <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Stipend</th>
                          <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Duration</th>
                          <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                          <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {displayedInternships.map((intern, idx) => (
                          <tr key={intern.id} className="hover:bg-orange-50/30 transition-all duration-150 group">
                            <td className="px-5 py-4 text-xs font-bold text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="px-5 py-4 max-w-xs">
                              <Link
                                href={`/internships/${generateSlug(intern.internship_title)}`}
                                className="text-sm text-slate-800 leading-snug group-hover:text-orange-600 transition-colors font-semibold block no-underline"
                              >
                                {intern.internship_title}
                              </Link>
                              <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1">
                                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {intern.company_name}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 mb-1">
                                {intern.internship_type}
                              </span>
                              {intern.domain_sector && intern.domain_sector !== "-" && (
                                <span className="block text-[11px] text-slate-500 font-medium">
                                  {intern.domain_sector}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-xs text-slate-600 max-w-[180px] whitespace-normal">
                              <span className="flex items-start gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span className="leading-snug break-words">
                                  {intern.location || `${intern.district_city || ''}, ${intern.state || 'India'}`}
                                </span>
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-xs font-bold text-green-700 mb-1">
                                <IndianRupee className="w-3 h-3" />
                                {intern.stipend_category === "Paid" ? (intern.stipend || "Paid") : "Unpaid"}
                              </span>
                            </td>
                            <td>
                              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {intern.duration || "N/A"}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              {intern.is_expired ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                                  <AlertCircle className="w-3 h-3" /> Expired
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                  <Check className="w-3 h-3" /> Active
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/internships/${generateSlug(intern.internship_title)}`}
                                  className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors inline-flex items-center justify-center"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                {intern.is_expired ? (
                                  <span
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed"
                                    title="Application deadline has passed"
                                  >
                                    Expired
                                  </span>
                                ) : intern.apply_link && (
                                  <a
                                    href={normalizeLink(intern.apply_link)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow hover:shadow-orange-100 cursor-pointer"
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
                  {displayedInternships.map((intern) => (
                    <div key={intern.id} className="bg-white rounded-3xl border border-orange-100/50 shadow-sm p-4 relative overflow-hidden">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 bg-orange-50 rounded-2xl text-orange-500 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <Link
                            href={`/internships/${generateSlug(intern.internship_title)}`}
                            className="text-sm font-bold text-slate-800 leading-snug hover:text-orange-600 transition-colors block no-underline"
                          >
                            {intern.internship_title}
                          </Link>
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
                        {intern.is_expired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-[10px] font-bold text-red-600 border border-red-200">
                            <AlertCircle className="w-3 h-3" /> Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-50 text-[10px] font-bold text-green-600 border border-green-200">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-slate-400">Location</span>
                          <span className="font-semibold truncate block">{intern.location || `${intern.district_city || ''}, ${intern.state || 'India'}`}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-slate-400">Duration</span>
                          <span className="font-semibold block">{intern.duration || "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/internships/${generateSlug(intern.internship_title)}`}
                          className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl transition-colors no-underline"
                        >
                          <Eye className="w-4 h-4" /> View Details
                        </Link>
                        {intern.is_expired ? (
                          <span
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed"
                          >
                            Expired
                          </span>
                        ) : intern.apply_link && (
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

                {/* Load More */}
                {canLoadMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-orange-600 bg-white border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 rounded-2xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>Load More Internships</>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Internship Guide Article Section */}
            <div className="mt-16">
              <InternshipGuideContent />
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            TAB 2: DYNAMIC SKILLUPS CONTENT (API DRIVEN)
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "skillups" && (
          <div>
            {/* Dynamic Filter Panel */}
            <div className="bg-white rounded-3xl border border-orange-100/85 shadow-md shadow-orange-100/20 p-5 md:p-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Category Filter */}
                <FilterDropdown
                  label="Category"
                  placeholder="All Categories"
                  value={selectedSkillCategory}
                  options={dynamicSkillCategories}
                  onChange={(val) => setSelectedSkillCategory(val || "All Categories")}
                />

                {/* Provider / Source Filter */}
                <FilterDropdown
                  label="Provider / Source"
                  placeholder="All Providers"
                  value={selectedSkillOrg}
                  options={dynamicSkillOrgs}
                  onChange={(val) => setSelectedSkillOrg(val)}
                />

                {/* Status Filter */}
                <FilterDropdown
                  label="Status"
                  placeholder="All Status"
                  value={selectedSkillStatus}
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "expired", label: "Expired" },
                  ]}
                  onChange={(val) => setSelectedSkillStatus(val)}
                />

                {/* View Mode Toggle */}
                <div className="flex flex-col justify-end">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Layout View
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl h-[38px]">
                    <button
                      type="button"
                      onClick={() => setSkillViewMode("cards")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        skillViewMode === "cards"
                          ? "bg-white text-orange-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSkillViewMode("table")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        skillViewMode === "table"
                          ? "bg-white text-orange-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <ListFilter className="w-3.5 h-3.5" />
                      <span>Table</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action row & Counts */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {(skillSearch || selectedSkillOrg || selectedSkillCategory !== "All Categories" || selectedSkillStatus !== "all") && (
                    <button
                      onClick={clearSkillFilters}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Clear Filters
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active: {filteredDynamicSkillUps.filter(s => !s.isExpired).length}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Expired: {filteredDynamicSkillUps.filter(s => s.isExpired).length}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold ml-1">
                    ({filteredDynamicSkillUps.length} SkillUp opportunities available)
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Content Rendering */}
            {skillupsLoading && allSkillups.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-orange-50 bg-white shadow-sm overflow-hidden animate-pulse p-6">
                  <div className="h-10 bg-slate-100 rounded-xl mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-48 bg-slate-100 rounded-2xl" />
                    ))}
                  </div>
                </div>
              </div>
            ) : skillupsError && filteredDynamicSkillUps.length === 0 ? (
              <div className="bg-red-50/50 border border-red-200 text-red-700 rounded-3xl p-6 text-center">
                <p className="font-bold">{skillupsError}</p>
                <button
                  onClick={fetchDynamicSkillUps}
                  className="mt-3 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Retry Loading SkillUps
                </button>
              </div>
            ) : filteredDynamicSkillUps.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
                <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-800">No SkillUps Found</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  {skillSearch
                    ? `No courses matching "${skillSearch}". Try another keyword.`
                    : "No courses found matching selected filters. Try clearing some criteria."}
                </p>
                <button
                  onClick={clearSkillFilters}
                  className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Reset Skill Filters
                </button>
              </div>
            ) : skillViewMode === "cards" ? (
              /* ── CARDS GRID (DYNAMIC FROM API) ── */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDynamicSkillUps.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white rounded-3xl border border-orange-100/70 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
                  >
                    {/* Top gradient accent bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-green-500" />

                    <div className="p-6">
                      {/* Provider badge & Expiry Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800">
                          {skill.org}
                        </span>
                        {skill.isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            <AlertCircle className="w-3 h-3" /> Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>

                      {/* Course Title */}
                      <h3
                        onClick={() => setSelectedSkillDetail(skill)}
                        className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug cursor-pointer line-clamp-2 mb-2"
                      >
                        {skill.title}
                      </h3>

                      {/* Category & Qualifications */}
                      <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-3">
                        <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{skill.category}</span>
                      </p>

                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-4 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Eligibility</span>
                          <span className="font-semibold text-slate-700 truncate max-w-[170px]" title={skill.qualifications}>
                            {skill.qualifications}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Deadline</span>
                          <span className="font-semibold text-slate-700">
                            {formatDateDDMMYYYY(skill.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA footer */}
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSkillDetail(skill)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      {skill.applyLink && !skill.isExpired && (
                        <a
                          href={normalizeLink(skill.applyLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-sm cursor-pointer"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ── TABLE VIEW (DYNAMIC FROM API) ── */
              <div className="bg-white rounded-3xl border border-orange-100/50 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-b border-orange-100">
                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">#</th>
                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">SkillUp Title</th>
                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Provider / Source</th>
                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Category</th>
                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Eligibility</th>
                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Deadline</th>
                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                        <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredDynamicSkillUps.map((skill, idx) => (
                        <tr key={skill.id} className="hover:bg-orange-50/30 transition-all duration-150 group">
                          <td className="px-5 py-4 text-xs font-bold text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-4 max-w-sm">
                            <button
                              type="button"
                              onClick={() => setSelectedSkillDetail(skill)}
                              className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors text-left block cursor-pointer"
                            >
                              {skill.title}
                            </button>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Posted: {formatDateDDMMYYYY(skill.postedDate)}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800">
                              {skill.org}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs font-medium text-slate-700">
                            {skill.category}
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-600 max-w-[200px] truncate" title={skill.qualifications}>
                            {skill.qualifications}
                          </td>
                          <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                            {formatDateDDMMYYYY(skill.deadline)}
                          </td>
                          <td className="px-5 py-4">
                            {skill.isExpired ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                                <AlertCircle className="w-3 h-3" /> Expired
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                <Check className="w-3 h-3" /> Active
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedSkillDetail(skill)}
                                className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors inline-flex items-center justify-center cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {skill.applyLink && !skill.isExpired && (
                                <a
                                  href={normalizeLink(skill.applyLink)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all shadow cursor-pointer"
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
            )}

            {/* Bottom Callout Banner */}
            <div className="mt-16 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
                  <Rocket className="w-3.5 h-3.5 text-amber-300" />
                  <span>Government & Accredited Upskilling Programs</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
                  Elevate Your Professional Credentials
                </h2>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
                  Access accredited vocational certifications, technology programs, and government-backed courses from SWAYAM, NPTEL, and the Ministry of Education.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      clearSkillFilters();
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    className="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-2xl text-sm font-extrabold transition-all shadow-md cursor-pointer"
                  >
                    View All SkillUps
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("internships")}
                    className="px-6 py-3 bg-orange-700/50 hover:bg-orange-700 text-white border border-white/30 rounded-2xl text-sm font-extrabold transition-all cursor-pointer"
                  >
                    Switch to Internships
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          DEDICATED SINGLE SKILLUP DETAIL MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedSkillDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-100 relative my-auto">
            
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 p-6 sm:p-8 text-white rounded-t-3xl">
              <button
                type="button"
                onClick={() => setSelectedSkillDetail(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                  {selectedSkillDetail.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-orange-700">
                  {selectedSkillDetail.org}
                </span>
                {selectedSkillDetail.isExpired ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white">
                    Application Closed
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 font-bold">
                    Open for Enrollment
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {selectedSkillDetail.title}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">

              {/* Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100">
                  <span className="block text-[11px] font-bold text-orange-700 uppercase tracking-wider mb-1">
                    Organization / Source
                  </span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    {selectedSkillDetail.org}
                  </p>
                </div>

                <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100">
                  <span className="block text-[11px] font-bold text-orange-700 uppercase tracking-wider mb-1">
                    Application Deadline
                  </span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    {formatDateDDMMYYYY(selectedSkillDetail.deadline)}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Eligibility & Qualification
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedSkillDetail.qualifications}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Posted Date & Age Limit
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDateDDMMYYYY(selectedSkillDetail.postedDate)} • {selectedSkillDetail.age}
                  </p>
                </div>
              </div>

              {/* Course Overview */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span>Program Description</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  This SkillUp program ({selectedSkillDetail.title}) is offered under {selectedSkillDetail.org} to equip candidates with recognized practical competencies and vocational proficiency.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSkillDetail(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>

                {selectedSkillDetail.notificationUrl && (
                  <a
                    href={normalizeLink(selectedSkillDetail.notificationUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>View Notification</span>
                  </a>
                )}

                {selectedSkillDetail.applyLink && !selectedSkillDetail.isExpired && (
                  <a
                    href={normalizeLink(selectedSkillDetail.applyLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md cursor-pointer"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
