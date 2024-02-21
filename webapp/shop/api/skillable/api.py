from urllib.parse import urlencode
from requests import Session


class SkillableAPI:
    def __init__(
        self,
        base_url: str,
        api_key: str,
        session: Session,
    ):
        self.base_url = base_url
        self.api_key = api_key
        self.session = session

    def make_request(
        self,
        method: str,
        path: str,
        headers: dict = {},
        data: dict = {},
        json: dict = {},
        retry: bool = True,
        allow_redirects: bool = True,
        params: dict = {},
    ):
        uri = f"{self.base_url}{path}"
        headers["api_key"] = f"{self.api_key}"

        response = self.session.request(
            method,
            uri,
            headers=headers,
            data=data,
            json=json,
            allow_redirects=allow_redirects,
            params=params,
        )

        if retry and response.status_code == 401:
            response = self.make_request(
                method,
                path,
                headers=headers,
                data=data,
                json=json,
                retry=False,
                params=params,
            )

        return response

    def launch_lab(self, userid: str, labid: str, **kwargs):
        path = f"/launch"
        return self.make_request(
            "POST", path, params={"userid": userid, "labid": labid}, **kwargs
        )

    def get_all_user_exams(self, userid: str, **kwargs):
        path = f"/userrunningandsavedlabs"
        return self.make_request(
            "GET", path, params={"userid": userid}, **kwargs
        )
