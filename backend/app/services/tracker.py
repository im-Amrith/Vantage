from __future__ import annotations

from app.models.schemas import JobApplication, TrackerColumn, TrackerData

class TrackerService:
    def __init__(self) -> None:
        self._data = TrackerData(
            columns={
                "wishlist": TrackerColumn(
                    id="wishlist",
                    title="Wishlist",
                    color="border-slate-500",
                    items=[
                        JobApplication(id="job-1", company="Netflix", role="Senior Backend Engineer", logo="https://logo.clearbit.com/netflix.com", days_ago=2, status="active"),
                        JobApplication(id="job-2", company="Airbnb", role="Staff Software Engineer", logo="https://logo.clearbit.com/airbnb.com", days_ago=5, status="active"),
                    ]
                ),
                "applied": TrackerColumn(
                    id="applied",
                    title="Applied",
                    color="border-blue-500",
                    items=[
                        JobApplication(id="job-3", company="Stripe", role="Product Engineer", logo="https://logo.clearbit.com/stripe.com", days_ago=15, status="stagnant"),
                        JobApplication(id="job-4", company="Uber", role="Backend Developer", logo="https://logo.clearbit.com/uber.com", days_ago=3, status="active"),
                    ]
                ),
                "phone": TrackerColumn(
                    id="phone",
                    title="Phone Screen",
                    color="border-purple-500",
                    items=[
                        JobApplication(id="job-5", company="DoorDash", role="Senior Engineer", logo="https://logo.clearbit.com/doordash.com", days_ago=1, status="active"),
                    ]
                ),
                "technical": TrackerColumn(
                    id="technical",
                    title="Technical Round",
                    color="border-orange-500",
                    items=[
                        JobApplication(id="job-6", company="Google", role="L5 Software Engineer", logo="https://logo.clearbit.com/google.com", days_ago=4, status="active"),
                    ]
                ),
                "offer": TrackerColumn(
                    id="offer",
                    title="Offer",
                    color="border-green-500",
                    items=[]
                ),
                "rejected": TrackerColumn(
                    id="rejected",
                    title="Rejected",
                    color="border-red-500",
                    items=[
                        JobApplication(id="job-7", company="Meta", role="Production Engineer", logo="https://logo.clearbit.com/meta.com", days_ago=20, status="active"),
                    ]
                )
            },
            column_order=["wishlist", "applied", "phone", "technical", "offer", "rejected"]
        )

    def get_data(self) -> TrackerData:
        return self._data

    def add_job(self, job: JobApplication, column_id: str = "wishlist") -> TrackerData:
        if column_id in self._data.columns:
            self._data.columns[column_id].items.append(job)
        return self._data

    def update_data(self, data: TrackerData) -> TrackerData:
        self._data = data
        return self._data
